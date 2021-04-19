import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from '../../../shared/storage.service';
import {environment} from '../../../../environments/environment';
import {EmailService} from '../../../shared/api-services/email.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

fromEmail:string=environment.fromEmail;
maxfileSize:number=environment.fileMaxSize;
composeForm: FormGroup;
fileToUpload: any = null;
showCC:boolean=false;
forwardId:string=null;
resendId:string=null;
mailObj:any=null;
flag:string='';


  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _emailService:EmailService,
    private _storage:StorageService,
    private toastr: ToastrService) { }


  ngOnInit(): void {
   this.formInit();
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.forwardId = params.get('forwardMailId');
      this.resendId = params.get('resendMailId');
      if (this.forwardId !== null) {
        this.flag='FORWARD';
        this.getByThread(this.forwardId,this.flag);
      }
      if (this.resendId !== null) {
        this.flag='RESEND';
        this.getByThread(this.resendId,this.flag);
      }
    })

  }


  getByThread(mailId,flag){
    this._emailService.getInboxSingleThread(mailId).subscribe(resp=>{
     this.mailObj=resp.inboxData;

        if(flag==='FORWARD'){
          this.composeForm.patchValue({
          recipients:this.mailObj.to,
          subject:'FW:'+this.mailObj.subject,
          body: this.mailObj.html,
          cc:this.mailObj.cc
        }) 
        }else if(flag === 'RESEND'){
          this.composeForm.patchValue({
          recipients:this.mailObj.to,
          subject:this.mailObj.subject,
          body: this.mailObj.html,
          cc:this.mailObj.cc
        }) 
          this.composeForm.controls['subject'].disable();
          this.composeForm.controls['body'].disable();
        }

    },err=>{
      this.toastr.error(err.error.message, 'inbox error');
    })
    }

  formInit(){
    this.composeForm = this.formBuilder.group({
      recipients: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(4)]],
      body:[''],
      cc:['']
  });
  this.fileToUpload=null;
  }

  get f() :any{ return this.composeForm.controls; }

  handleFileInput(files: FileList) {
    let sizeLimit= ((this.maxfileSize * 1024)*1024);
    
    this.fileToUpload = files;
    for(var i=0;i<files.length;i++){
      if(files[i].size > sizeLimit){
       this.toastr.warning(`${files[i].name} exceeded ${this.maxfileSize} MB`,`file size`);
       this.fileToUpload=null;
      }
      let result = files[i].name.split('.');
      let ext = result[result.length - 1];
      if(!this.filesAllowed(ext.toLowerCase())){
        this.toastr.warning(`Choose a file having extension of pdf / docx / ppt / txt / csv / pptx /
        doc / xlxs / png / jpg`,'file extension');
        this.fileToUpload=null;
      }
    }
} 

filesAllowed=(ext): boolean =>{
  let isValid: boolean = false;
  switch (ext) {
    case 'pdf': isValid = true; break;
    case 'png': isValid = true; break;
    case 'jpg': isValid = true; break;
    case 'jpeg': isValid = true; break;
    case 'txt': isValid = true; break;
    case 'xlsx': isValid = true; break;
    case 'csv': isValid = true; break;
    case 'ppt': isValid = true; break;
    case 'docx': isValid = true; break;
    case 'doc': isValid = true; break;
    case 'pptx': isValid = true; break;
    case 'mp4': isValid = true; break;
    case 'gif': isValid = true; break;
    default: isValid = false;
  }
  return isValid;
}

  onSubmit() {
   
    if (this.composeForm.invalid) {
      return;
  }

  const formData = new FormData();
  formData.append('recipients',this.composeForm.value.recipients);
  formData.append('subject',this.composeForm.value.subject);
  formData.append('body',this.composeForm.value.body);
  // formData.append('cc',subdomainName.name);
  for(let i=0;i<this.fileToUpload.length;i++){
    formData.append('attachments',this.fileToUpload[i]);
  }


this._emailService.sendMail(formData).subscribe(resp=>{
  this.toastr.success('Mail sent successfully', 'Success !');
  this.formInit();
},err=>{
  this.toastr.error(err.error.message, 'email error');
})

}


resend(){
  const formData = new FormData();       
  formData.append('recipients',this.composeForm.value.recipients);
  formData.append('subject',this.composeForm.value.subject || this.mailObj.subject);
  formData.append('body',this.composeForm.value.body || this.mailObj.html);
  // formData.append('cc',subdomainName.name);
  // for(let i=0;i<this.fileToUpload.length;i++){
  //   formData.append('attachments',this.fileToUpload[i]);
  // }


this._emailService.sendMail(formData).subscribe(resp=>{
  this.toastr.success('Mail sent successfully', 'Success !');
  this.formInit();
  this.router.navigate(['dashboard/home']);
},err=>{
  this.toastr.error(err.error.message, 'email error');
})
}

}
