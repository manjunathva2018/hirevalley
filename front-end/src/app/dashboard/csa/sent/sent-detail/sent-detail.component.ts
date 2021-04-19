import { Component, OnInit,Input, SimpleChanges, OnChanges,Output,EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import {EmailService} from './../../../../shared/api-services/email.service';
import {DomSanitizer} from '@angular/platform-browser';
// import { HttpEventType} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sent-detail',
  templateUrl: './sent-detail.component.html',
  styleUrls: ['./sent-detail.component.scss']
})
export class SentDetailComponent implements OnInit,OnChanges {
  baseUrl:string=environment.serverURL;
  @Output() refreshMail: EventEmitter<any> = new EventEmitter();
  @Input() public mailId:string='';

  mailObj:any={};
  blobUrl:string='';


  constructor(private activatedRoute: ActivatedRoute, 
    private _emailService:EmailService,
    private sanitizer:DomSanitizer,
    private toastr: ToastrService) { }

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
    this._emailService.getSentSingleThread(mailId).subscribe(resp=>{
     this.mailObj=resp.sentData;
    },err=>{
      this.toastr.error(err.error.error, 'sent emails loading error');
    })
    }
  
    deleteThread(mailId){
      this._emailService.deleteSentThread(mailId).subscribe(resp=>{
        this.toastr.success('mail is deleted successfully', 'sent email');
        this.refreshMail.emit(true);
        this.mailObj={};
      },err=>{
        this.toastr.error(err.error.error, 'sent email');
      })
    }
  
  downloadAttachment(filename){
    window.open(`${this.baseUrl}/api/email/sent/filename/${filename}`,"_self");
  }

}
