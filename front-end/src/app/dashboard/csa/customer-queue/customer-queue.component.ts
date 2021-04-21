import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, Input, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { throttleTime, tap, debounceTime } from 'rxjs/operators';
import { Howl } from 'howler';
import { ToastrService } from 'ngx-toastr';

import { Room } from '../../../shared/model/room';
import { Notification } from '../../../shared/model/notification';
import { MessageObj } from '../../../shared/model/message-obj';
import { CustomerQueueService } from '../../../shared/api-services/customer-queue.service';
import { RoomChatService } from './../../../shared/room-chat.service';
import { StorageService } from '../../../shared/storage.service';
import { TypingService } from '../../../shared/typing.service';
import { ChatHistoryService } from '../../../shared/api-services/chat-history.service';
import { ChatService } from '../../../shared/chat.service';
import { QueueService } from '../../../shared/queue.service';
import { LoginService } from '../../../shared/api-services/login.service';

@Component({
  selector: 'app-customer-queue',
  templateUrl: './customer-queue.component.html',
  styleUrls: ['./customer-queue.component.scss'],
  providers: [Room, MessageObj, Notification]
})
export class CustomerQueueComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  dataSource: any = new MatTableDataSource<any>([]);
  editDeleteAction: boolean = false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  @Input() public displayedColumns = ['index', 'requestedAt', 'userName', 'role', 'issue', 'ack'];
  queues = [];
  userData: any;

  //chat box
  @ViewChild('chatScroll', { static: false }) private chatScrollContainer: ElementRef;
  messageList: any = [];
  chatRoom: string;
  roomName: string;
  sound = new Howl({
    src: ['assets/sounds/Water-Drop-Bloop-Sound.mp3']
  });
  customer: any;
  showChatBox: boolean = false;


  constructor(private _customerQ: CustomerQueueService,
    private toastr: ToastrService,
    private _roomChatService: RoomChatService,
    private _storageService: StorageService,
    private router: Router,
    public _typingService: TypingService,
    public room: Room,
    public newChat: MessageObj,
    public notification: Notification,
    private _chatHistoryService: ChatHistoryService,
    private _chatService: ChatService,
    private _queueService: QueueService,
    private _loginService: LoginService) { }

  ngOnInit(): void {
    this.userData = this._storageService.getSession('userData');
    this.getAllPendingQs();

    this.initCustomerChat();

    this._chatService.getMessages().subscribe((message) => {
      if (this.room._id == '' || this.room._id == undefined) {
        this.room._id = message.roomId;
      }
      this.sound.play();
      this.messageList.push(message);
    })

    this._roomChatService.userRoomLeftEvent().subscribe((room) => {
      let user = room.users.filter(ele => ele._id != this.userData.id)[0];
      this.notification.display(`${user.userName} has left the room or has ended the chat.`);
      this.toastr.info(`${user.userName} has left the room or has ended the chat.`, 'Info');
    })

    this._chatService.newChatEvent().subscribe((room) => {
      //  this.room = room;
    })

    this._queueService.recieveQUpdateEvent().subscribe((room) => {
      this.getAllPendingQs();
    })

    //typing receive event
    this._typingService.recieveTypeEvent().subscribe((typingObj) => {
      this._typingService.setTypingObj(typingObj.userName, typingObj.roomName, typingObj.isTyping);
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {

  }

  getAllPendingQs() {
    this._customerQ.getAllPendingQ().subscribe(resp => {
      this.queues = resp.chatQData;
      this.dataSource.data = this.queues;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {
      this.toastr.error(err.error.error, 'get customer queues API error');
    })
  }

  deleteSelcted() {
    let selected = this.selection.selected.map(item => { return item._id });
    let queues = { selected: selected }
    this._customerQ.deleteSelectedQs(queues).subscribe(resp => {
      this.toastr.success(`total queue deleted is ${resp.chatQData.deletedCount}`, 'success');
      this.getAllPendingQs();
      this.selection.clear();
    }, err => {
      this.toastr.error(err.error.error, 'queues deletion error');
    })
  }

  acknowledgeRoom(row): void {
    this.newChat = { roomId: '', room: '', message: '', fromName: '', fromId: '', createdAt: new Date, members: [] };
    let room = row.payload;
    this.messageList = [];
    room.users.push({ userName: this.userData.userName, _id: this.userData.id });
    this._roomChatService.joinNewRoom(room);
    this._storageService.setSession('room', row);
    this.room = room;
    let queue = { "id": row._id, "userId": this.userData.id };
    this._customerQ.ackQ(queue).subscribe(resp => {
      this.initCustomerChat();
      this.notification.clear();
    }, err => {
      this.toastr.error(err.error.error, 'queues acknowledge error');
    });
  }

  initCustomerChat() {
    let room = this._storageService.getSession('room');
    if (room !== null) {
      this.showChatBox = true;
      this._loginService.getSingleUser(room.payload.owner).subscribe(resp => {
        this.customer = resp.userData;
        this.chatHistory(room.payload);
        let userData = this.userData;
        userData.isBusy = true;
        this._roomChatService.updateCSABusy(userData);
      }, err => {

      })
    }
  }

  typingEvent() {
    let typingObj = {
      userName: this.userData.userName,
      roomName: this.room.roomName,
      isTyping: true
    };
    let typing = of(this._typingService.typing)
      .pipe(debounceTime(1000), throttleTime(1000),
        tap(next => {
          this._typingService.sendTypeEvent(typingObj);
          setTimeout(() => { typingObj.isTyping = false; this._typingService.sendTypeEvent(typingObj); }, 2000)
        }
        ));
    typing.subscribe(next => { });
  }


  ngAfterViewChecked() {

  }

  scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  sendMessage() {
    this.newChat.roomId = this.room._id;
    this.newChat.room = this.room.roomName;
    this.newChat.fromName = this.userData.userName;
    this.newChat.members = this.room.users;
    this.newChat.fromId = this.userData.id;
    this.newChat.createdAt = new Date();
    if (this.newChat.message.length > 0) {
      this.messageList.push(this.newChat);
      this._chatService.sendMessage(this.newChat);
      this.newChat = { roomId: '', room: '', message: '', fromName: '', fromId: '', createdAt: new Date, members: [] };
    }
  }

  chatHistory(room): void {
    this.room = room;
    // this.joinParticularRoom();
    this._chatHistoryService.getAllChatsByRoomId(room._id).subscribe(resp => {
      this.messageList = resp.chatData;
      this.scrollToBottom();
    }, err => {
      this.toastr.error(err.error.error, 'chat history error');
    })
  }

  endEmpJSChat() {
    let userData = this.userData;
    userData.isBusy = false;
    this._roomChatService.updateCSABusy(userData);
    this.messageList = [];
    this._roomChatService.leaveRoom(this.room);
    let q = this._storageService.getSessionByProps('room', '_id');
    this._customerQ.markDeleted({ 'id': q }).subscribe(resp => {
      this._storageService.removeSession('room');
      this.customer = {};
    }, err => { });
    this.showChatBox = false;
  }


  goToEmail() {
    this.router.navigate([`dashboard/csa/inbox/${this.customer.email}`]);
  }

  goToHistory() {
    this.router.navigate([`dashboard/csa/chat-history/${this.customer._id}`]);
  }

}
