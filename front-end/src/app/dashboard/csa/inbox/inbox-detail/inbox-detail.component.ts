import { Component, OnInit,Input, SimpleChanges, OnChanges,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import {EmailService} from './../../../../shared/api-services/email.service';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inbox-detail',
  templateUrl: './inbox-detail.component.html',
  styleUrls: ['./inbox-detail.component.scss']
})
export class InboxDetailComponent implements OnInit,OnChanges {
  baseUrl:string=environment.serverURL;
  @Output() refreshMail: EventEmitter<any> = new EventEmitter();
  @Input() public mailId:string='';
mailObj:any={};
blobUrl:string='';



  constructor( private activatedRoute: ActivatedRoute,
     private _emailService:EmailService,
    private sanitizer:DomSanitizer,
    private toastr: ToastrService,
    private router: Router,) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
    //   this.mailId = params.get('id');
    //   if (this.mailId !== null) {
    //     this.getByThread(this.mailId);
    //   }
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['mailId']){
      if(changes.mailId.currentValue!=null){
        this.getByThread(changes.mailId.currentValue);
      }
    } 
  }


  getByThread(mailId){
  this._emailService.getInboxSingleThread(mailId).subscribe(resp=>{
    if(!resp.inboxData.isRead){
      this.markThreadSeen(mailId);
    }
   this.mailObj=resp.inboxData;
  },err=>{
    this.toastr.error(err.error.error, 'inbox error');
  })
  }

 markThreadSeen(mailId){
   this._emailService.markInboxThreadSeen(mailId).subscribe(resp=>{},err=>{});
   this.refreshMail.emit(true);
 }

 
deleteThread(mailId){
  this._emailService.deleteInboxThread(mailId).subscribe(resp=>{
    this.toastr.success('mail deleted successfully', 'mail');
    this.refreshMail.emit(true);
    this.mailObj={};
  },err=>{
    this.toastr.error(err.error.error, 'inbox error');
  })
}

downloadAttachment(filename){
  window.open(`${this.baseUrl}/api/email/inbox/filename/${filename}`,"_self");
}

forward(mailId){
  this.router.navigate([`dashboard/csa/compose/forward/${mailId}`]);
}

resend(mailId){
  this.router.navigate([`dashboard/csa/compose/resend/${mailId}`]);
}

}
