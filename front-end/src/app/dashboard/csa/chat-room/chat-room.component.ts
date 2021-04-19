import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { Howl } from 'howler';
import { ToastrService } from 'ngx-toastr';
import { throttleTime, tap, debounceTime } from 'rxjs/operators';

import { Room } from '../../../shared/model/room';
import { MessageObj } from '../../../shared/model/message-obj';
import { Notification } from '../../../shared/model/notification';
import { StorageService } from '../../../shared/storage.service';
import { ChatService } from '../../../shared/chat.service';
import { RoomService } from './../../../shared/api-services/room.service';
import { RoomChatService } from './../../../shared/room-chat.service';
import { LoginService } from './../../../shared/api-services/login.service';
import { ChatHistoryService } from '../../../shared/api-services/chat-history.service';
import { OnlineMembersService } from '../../../shared/online-members.service';
import { TypingService } from '../../../shared/typing.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [Room, MessageObj, Notification]
})

export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatScroll', { static: true }) private chatScrollContainer: ElementRef;
  newChatRoom: any = {};
  messageList: any = [];
  fromName: string = '';
  fromId: string = '';
  chatRoom: string;
  roomName: string;
  chatSubscription$: Subscription;
  chatRooms: any = [];
  onlineMembers = [];
  members = [];
  userData: any;
  acceptInvite: any;
  acceptCSAInvite: any;
  contact = [];
  privateChat: boolean = false;
  namespace: string = '';
  sound = new Howl({
    src: ['assets/sounds/Water-Drop-Bloop-Sound.mp3']
  });
  searchText: '';
  page: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _chatService: ChatService,
    private _storageService: StorageService,
    private _roomService: RoomService,
    private toastr: ToastrService,
    private room: Room,
    public newChat: MessageObj,
    public notification: Notification,
    private _roomChatService: RoomChatService,
    private _loginService: LoginService,
    private _chatHistoryService: ChatHistoryService,
    private _onlineMembersService: OnlineMembersService,
    public _typingService: TypingService
  ) { }

  sendMessage() {
    this.newChat.roomId = this.room._id;
    this.newChat.room = this.room.roomName;
    this.newChat.fromName = this.fromName;
    this.newChat.members = this.room.users;
    this.newChat.fromId = this.fromId;
    this.newChat.createdAt = new Date();
    if (this.newChat.message.length > 0) {
      this.messageList.push(this.newChat);
      this._chatService.sendMessage(this.newChat);
      this.newChat = { roomId: '', room: '', message: '', fromName: '', fromId: '', createdAt: new Date, members: [] };
    }
  }

  ngOnInit() {



    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.chatRoom = params.get('id');
      if (this.chatRoom !== null) {
        this.initializeChatRoom(this.chatRoom);
      }
    })

    this.chatSubscription$ = this._chatService.getMessages().subscribe((message) => {
      if (this.room._id == '' || this.room._id == undefined) {
        this.room._id = message.roomId;
      }
      this.sound.play();
      this.messageList.push(message);
    })

    //recive online members array list
    this._onlineMembersService.recieveOnlineMembers().subscribe((users) => {
      this.onlineMembers = users;
    })

    this._roomChatService.newRoomEvent().subscribe((room) => {
      this.acceptInvite = room;
      this.messageList = [];
    })

    this._roomChatService.newCSARoomEvent().subscribe((room) => {
      this.acceptCSAInvite = room;
      this.messageList = [];
    })

    this.getUsers();

    this._roomChatService.userRoomLeftEvent().subscribe((room) => {
      this.notification.display(`${room.roomName} has left the room or has ended the chat.`);
      this.messageList = [];
      this.acceptInvite = null;
      this.endEmpJSChat();
      this._roomChatService.leaveRoom(room);
    })

    this._chatService.newChatEvent().subscribe((room) => {
      this.room = room;
      this.notification.display(room.notify);
    })

    //typing receive event
    this._typingService.recieveTypeEvent().subscribe((typingObj) => {
      this._typingService.setTypingObj(typingObj.userName, typingObj.roomName, typingObj.isTyping);
    })
  }

  ngOnDestroy() {
    if (this.chatSubscription$ != undefined) {
      this.chatSubscription$.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  initializeChatRoom(chatRoom) {
    this.messageList = [];
    this.userData = this._storageService.getSession('userData');
    this.fromName = this.userData.userName;
    this.fromId = this.userData.id;

    this._roomService.getAllRoomDetails().subscribe(resp => {
      this.chatRooms = resp.roomData;
      if (chatRoom == 1) {
        let filterdRooms = resp.roomData.filter(room => { return room.namespace == 'CUSTOMER-SERVICE-ASSOCIATIVE' });
        this.roomName = 'Customer Service Associates';
        this.namespace = 'CUSTOMER-SERVICE-ASSOCIATIVE';
        this.chatRooms = [];
        filterdRooms.forEach(ele => {
          if (ele.roomType == 'GROUP_CHAT') {
            this.chatRooms.push(ele);
          }
          ele.users.forEach(user => {
            if (user._id == this.userData.id) {
              this.chatRooms.push(ele);
            }
          });
        });
        this.privateChat = true;
        this.notification.clear();
      } else if (chatRoom == 2) {
        this.chatRooms = resp.roomData.filter(room => { return (room.namespace == 'EMPLOYER' && room.owner._id == this.userData.id) });
        this.roomName = 'Employer';
        this.namespace = 'EMPLOYER';
        this.privateChat = false;
        this.notification.clear();
        this.activatedRoute.queryParamMap.subscribe(params => {
          this._chatHistoryService.getAllChatsByRoomId(params).subscribe(resp => {
            this.messageList = resp.chatData;
          }, err => {
            this.toastr.error(err.error.error, 'chat history error');
          })

        });
      } else if (chatRoom == 3) {
        this.chatRooms = resp.roomData.filter(room => { return (room.namespace == 'JOB-SEEKER' && room.owner._id == this.userData.id) });
        this.roomName = 'Job-Seeker';
        this.namespace = 'JOB-SEEKER';
        this.notification.clear();
        this.privateChat = false;
        this.activatedRoute.queryParamMap.subscribe(params => {
          this._chatHistoryService.getAllChatsByRoomId(params).subscribe(resp => {
            this.messageList = resp.chatData;
          }, err => {
            this.toastr.error(err.error.error, 'chat history error');
          })
        });
      }

    }, err => {
      this.toastr.error(err.error.error, 'chat room error');
    })



  }

  // getAvailableRooms(): void {
  //   this._roomService.getAllRoomByNamespace('CUSTOMER-SERVICE-ASSOCIATIVE').subscribe(resp => {

  //   }, err => {

  //   })
  // }

  getUsers(): void {
    this._loginService.getAllUsersByRole(1).subscribe(resp => {
      this.contact = resp.userData.filter(user => { return user._id !== this.userData.id });
    }, err => {

    })
  }

  joinParticularRoom(): void {
    this.notification.clear();
    this.acceptInvite = null;
    this.acceptCSAInvite = null;
    this._roomChatService.joinRoom(this.room);
  }

  createCSARoom(): void {

    // if(!user1){
    this.messageList = [];
    this.room.users = [
      {
        userName: this.fromName,
        _id: this.fromId
      },
      {
        userName: this.newChatRoom.userName,
        _id: this.newChatRoom._id
      }];
    this.room.roomType = 'PRIVATE_CHAT';
    this.room.issue = 'private chat';
    this.room.namespace = 'CUSTOMER-SERVICE-ASSOCIATIVE';
    this.room.roomName = this.newChatRoom.userName;
    this.room.owner = { userName: this.fromName, _id: this.fromId };
    this._roomChatService.createCSARoom(this.room);
    this.joinParticularRoom();
    // }else{
    //   this.toastr.error('you already have invited the user for private chat, please check your chat room', 'error');
    // }


  }

  acceptRoom(room): void {
    this.room = room;
    this.room.owner = { userName: this.fromName, _id: this.fromId };
    this.room.users.push({ userName: this.fromName, _id: this.fromId });
    this.room.accepted = true;
    this._roomChatService.joinNewRoom(room);
  }

  acceptCSARoom(room): void {
    this.room = room;
    this.room.accepted = true;
    this._roomChatService.saveCSANewRoom(room);
  }


  chatHistory(room): void {
    this.room = room;
    this.joinParticularRoom();
    this._chatHistoryService.getAllChatsByRoomId(room._id).subscribe(resp => {
      this.messageList = resp.chatData;
    }, err => {
      this.toastr.error(err.error.error, 'chat history error');
    })

  }

  endEmpJSChat() {
    this._roomChatService.updateCSABusy(this.userData);
    this.messageList = [];
    this._roomChatService.leaveRoom(this.room);
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
