import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../shared/api-services/login.service';
import { StorageService } from './../shared/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide:boolean = true;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _loginService:LoginService,
    private _storage:StorageService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
  });
  }
  get f() :any{ return this.loginForm.controls; }

  onSubmit() {
   
    if (this.loginForm.invalid) {
      return;
  }

this._loginService.checkUserLogin(this.loginForm.value).subscribe(resp=>{
    if(resp.status){
      let roleType:string='';
      let roleName:string='';
      switch(resp.userData.role){
        case 1:roleType='CSA';roleName='Customer Service Associative';break;
        case 2:roleType='EMP';roleName='Employer';break;
        case 3:roleType='JS';roleName='Job Seeker';break;
      }
      console.log(roleName,roleType);

      let obj={"userName":resp.userData.userName,
      "role":resp.userData.role,
      "id":resp.userData.id,
      "roleType":roleType,
      "roleName":roleName,
      "isAuthenticated":true,"x_auth_token":''};
      
      this._storage.setSession("userData",obj);

      // this._storage.setSession("x_auth_token",resp.headers.get('x_auth_token'));
    
      if(resp.userData.role == 1){
        this.router.navigate(['dashboard/home']);
      }
    
      if(resp.userData.role == 2){
        this.router.navigate(['dashboard/home']);
      }
    
      if(resp.userData.role == 3){
        this.router.navigate(['dashboard/home']);
      }
    }else{
      this.toastr.error(resp.error, 'login error');
    }
  
   
  },err=>{
     console.log("login error",err);
     this.toastr.error(err.error.error, 'login error');
  })

}

}
