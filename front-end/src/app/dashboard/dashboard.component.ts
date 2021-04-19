import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {StorageService} from './../shared/storage.service';
import {SocketNamespaceOneService} from './../shared/socket-namespace-one.service';
import {RoomChatService} from '../shared/room-chat.service';
import {ChatService} from '../shared/chat.service';
import {OnlineMembersService} from '../shared/online-members.service';
import {NotificationService} from '../shared/notification.service';
import {TypingService} from '../shared/typing.service';
import {QueueService} from '../shared/queue.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers:[
    SocketNamespaceOneService,
    RoomChatService,
    ChatService,
    OnlineMembersService,
    NotificationService,
    TypingService,
    QueueService
  ]
})
export class DashboardComponent {
  public user:any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  role: any = {
    "ROLE_CSA": [
      {
        'label': 'Home', 'icon': 'home', 'link': '/dashboard/home'
      },
      {
        'label': 'Compose', 'icon': 'email', 'link': '/dashboard/csa/compose'
      },
      {
        'label': 'Inbox', 'icon': 'inbox', 'link': '/dashboard/csa/inbox'
      }, {
        'label': 'Sent', 'icon': 'present_to_all', 'link': '/dashboard/csa/sent'
      },
      {
        'label': 'Customer service associative Chat', 'icon': 'comment', 'link': '/dashboard/csa/csa-chat/1'
      },
      {
        'label': 'Customer chat queue', 'icon': 'queue', 'link': '/dashboard/csa/customer-queue'
      },
      {
        'label': 'Communication history', 'icon': 'history', 'link': '/dashboard/csa/chat-history'
      }
    ], "ROLE_EMP": [
      {
        'label': 'Home', 'icon': 'home', 'link': '/dashboard/home'
      },
      {
        'label': 'Chat', 'icon': 'chat', 'link': '/dashboard/employer/employer-chat'
      }],
    "ROLE_JS": [
      {
        'label': 'Home', 'icon': 'home', 'link': '/dashboard/home'
      },
      {
        'label': 'Chat', 'icon': 'chat', 'link': '/dashboard/job-seeker/jobseeker-chat'
      }]
  }; 
  
       navList:Array<any>=[];

  constructor(private breakpointObserver: BreakpointObserver,
    private _storageService:StorageService,   private router:Router,
    private _roomChatService: RoomChatService,  private toastr: ToastrService) {}

    ngOnInit(){
      this.user=this._storageService.getSession('userData');
  
      if(this.user !== undefined){
        let temp=this.user.role;
      
          if(temp === 1){
           this.navList=this.role.ROLE_CSA;
          }else if(temp === 2){
           this.navList=this.role.ROLE_EMP;
          }else if(temp === 3){
           this.navList=this.role.ROLE_JS;
          }else{
            this.navList=[];
          }
       }

       this._roomChatService.newRoomEvent().subscribe((room) => {
        // this.toastr.warning(room.roomName, 'new chat request from a customer');
      })
    }

    logout(){
      this._storageService.removeSession('userData');
      this.router.navigate(['/login']);
    }

}
