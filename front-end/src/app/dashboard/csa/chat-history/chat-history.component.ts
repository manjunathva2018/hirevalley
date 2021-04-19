import { Component, OnInit, OnDestroy,AfterViewChecked,ElementRef, ViewChild, Input} from '@angular/core';
import { ActivatedRoute, ParamMap  } from '@angular/router';
import { Subscription} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import {StorageService} from '../../../shared/storage.service';
import {RoomService} from './../../../shared/api-services/room.service';
import {Room} from '../../../shared/model/room';
import {ChatHistoryService} from '../../../shared/api-services/chat-history.service';


@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  providers:[Room]
})

export class ChatHistoryComponent implements OnInit,OnDestroy,AfterViewChecked {
  @ViewChild('chatScroll',{static: true}) private chatScrollContainer: ElementRef;
  page: number = 1;
  messageList:any=[];
  fromName:string='';
  fromId:string='';
  chatRoom:string;
  roomName:string;
  chatRooms:any=[];
  userData:any;
  searchText:string='';

  constructor(
    private activatedRoute: ActivatedRoute,
    private _storageService: StorageService,
    private _roomService: RoomService,
    private toastr: ToastrService,
    private _chatHistoryService: ChatHistoryService
    ) { }

  sendMessage(){

  }

  ngOnInit(){
    this.userData = this._storageService.getSession('userData');
    this.displayChatRooms();

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.chatRoom = params.get('userId');
      if (this.chatRoom !== null) {
        this.searchText=this.chatRoom;
      }
    })

  }

  ngOnDestroy() {
  }

  ngAfterViewChecked(){
    // this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}

  displayChatRooms() {
    this.messageList = [];
    this._roomService.getAllRoomDetails().subscribe(resp => {
      this.chatRooms = resp.roomData;
      this.chatRooms = resp.roomData.filter(room => { return (room.namespace !== 'CUSTOMER-SERVICE-ASSOCIATIVE' ) });
      this.roomName = 'Employer';
    }, err => {
      this.toastr.error(err.error.error, 'chat room error');
    })
}


  chatHistory(room): void {
    this._chatHistoryService.getAllChatsByRoomId(room._id).subscribe(resp => {
      this.messageList = resp.chatData;
    }, err => {
      this.toastr.error(err.error.error, 'chat history error');
    })
  }

}
