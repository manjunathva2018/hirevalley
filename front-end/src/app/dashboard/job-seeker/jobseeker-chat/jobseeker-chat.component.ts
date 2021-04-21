import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of } from 'rxjs';
import { throttleTime, tap, debounceTime } from 'rxjs/operators';

import { Room } from '../../../shared/model/room';
import { MessageObj } from '../../../shared/model/message-obj';
import { Notification } from '../../../shared/model/notification';
import { ChatService } from '../../../shared/chat.service';
import { StorageService } from '../../../shared/storage.service';
import { RoomService } from './../../../shared/api-services/room.service';
import { RoomChatService } from '../../../shared/room-chat.service';
import { ChatHistoryService } from '../../../shared/api-services/chat-history.service';
import { OnlineMembersService } from '../../../shared/online-members.service';
import { TypingService } from '../../../shared/typing.service';
import { NotificationService } from '../../../shared/notification.service';

@Component({
  selector: 'app-jobseeker-chat',
  templateUrl: './jobseeker-chat.component.html',
  styleUrls: ['./jobseeker-chat.component.scss'],
  providers: [Room, Notification, MessageObj]
})
export class JobseekerChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatScroll', { static: true }) private chatScrollContainer: ElementRef;
  newChatRoom: any;
  messageList: any = [];
  chatRooms: any = [];
  userData: any;
  selectedIssue: any;

  messagesSubscription$: Subscription;
  newChatSubscription$: Subscription;
  onlineCSAMembers = [];
  sound = new Howl({
    src: ['assets/sounds/4-Hit-Quick-Notification.mp3']
  });

  constructor(private _chatService: ChatService,
    private _storageService: StorageService,
    private _roomService: RoomService,
    private toastr: ToastrService,
    public room: Room,
    public newChat: MessageObj,
    public notification: Notification,
    private _roomChatService: RoomChatService,
    private _chatHistoryService: ChatHistoryService,
    private _onlineMembersService: OnlineMembersService,
    public _typingService: TypingService,
    public _notificationService: NotificationService) { }



  ngOnInit(): void {
    this.userData = this._storageService.getSession('userData');
    this.getAllChatRooms();

    this.messagesSubscription$ = this._chatService.getMessages().subscribe((message) => {
      this.sound.play();
      this.messageList.push(message);
    })

    //update room object
    this._roomChatService.updateRoomEvent().subscribe((room) => {
      if (room.notify != undefined && room.notify == true) {
        let user = room.users.filter(ele => ele._id != this.userData.id)[0];
        this.notification.display(`Our customer service associative, ${user.userName} is online to resolve your issue, please enter 'Hi' into the chat box and feel free to ask your queries.`);
      }
      this.room = room;
    })

    //recive online members array list
    this._onlineMembersService.recieveOnlineMembers().subscribe((users) => {
      this.onlineCSAMembers = users;
    })

    //if CSA ends the chat
    this._roomChatService.userRoomLeftEvent().subscribe((room) => {
      let userLeft = room.users.filter((el) => el._id != this.userData.id)[0];
      this.notification.display(`${userLeft.userName} has ended the chat.`);
      this.messageList = [];
      let temp = {
        roomId: this.room._id,
        room: this.room.roomName,
        message: 'Thank you very much. Please come back if you have any other issue.',
        fromName: '',
        fromId: '',
        createdAt: new Date,
        members: this.room.users
      };
      this.messageList.push(temp);
      this._roomChatService.leaveRoom(room);
    })

    //typing receive event
    this._typingService.recieveTypeEvent().subscribe((typingObj) => {
      this._typingService.setTypingObj(typingObj.userName, typingObj.roomName, typingObj.isTyping);
    })


    //notification event
    this._notificationService.recieveNotificationEvent().subscribe((data) => {
      this.notification.display(`All our customer service associates are busy assisting other customer, you are number ${data} at the queue, please wait.`);
    })
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

  ngOnDestroy(): void {
    if (this.messagesSubscription$ != undefined) {
      this.messagesSubscription$.unsubscribe();
    }
    if (this.newChatSubscription$ != undefined) {
      this.newChatSubscription$.unsubscribe();
    }
  }

  sendMessage() {
    this.newChat.roomId = this.room._id;
    this.newChat.room = this.room.roomName;
    this.newChat.fromName = this.userData.userName;
    this.newChat.fromId = this.userData.id;
    this.newChat.members = this.room.users;
    this.newChat.createdAt = new Date();
    if (this.newChat.message.length > 0) {
      this.messageList.push(this.newChat);
      this._chatService.sendMessage(this.newChat);
      this.newChat = { roomId: '', room: '', message: '', fromName: '', fromId: '', createdAt: new Date, members: [] };
    }
  }

  getAllChatRooms(): void {
    this._roomService.getAllRoomByNamespace('JOB-SEEKER').subscribe(resp => {
      this.chatRooms = resp.roomData.filter(room => { return room.roomType !== 'GROUP_CHAT' });
    }, err => {
      this.toastr.error(err.error.error, 'chat error');
    })
  }


  joinRoom() {
    this.messageList = [];
    this._roomChatService.joinRoom(this.room);
  }

  leaveRoom() {
    this._roomChatService.leaveRoom(this.room);
    this.messageList = [];
    let temp = {
      roomId: this.room._id,
      room: this.room.roomName,
      message: 'Thank you very much. Please come back if you have any other issue.',
      fromName: '',
      fromId: '',
      createdAt: new Date,
      members: this.room.users
    };
    this.notification.clear();
    this.messageList.push(temp);
    this.room = { _id: '', roomName: '', users: [], issue: '', namespace: '', roomType: '' };
  }

  createRoom(): void {
    this.messageList = [];
    this.notification.clear();
    this.room._id = '';
    this.room.users = [{ userName: this.userData.userName, _id: this.userData.id }];
    this.room.owner = { userName: this.userData.userName, _id: this.userData.id };
    this.room.roomType = 'PRIVATE_CHAT';
    this.room.issue = this.selectedIssue;
    this.room.namespace = 'JOB-SEEKER';
    this.room.roomName = this.userData.userName;
    this._roomChatService.createRoom(this.room);
    this.joinRoom();
  }

  chatHistory(room): void {
    this._chatHistoryService.getAllChatsByRoomId(room._id).subscribe(resp => {
      this.messageList = resp.chatData;
      this.scrollToBottom();
    }, err => {
      this.toastr.error(err.error.error, 'chat history error');
    })
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

}
