import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ValidationErrors, ValidatorFn,AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../shared/api-services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit{
  registerForm :FormGroup;

  constructor(
    private fb: FormBuilder,
     private _loginService:LoginService, 
      private toastr: ToastrService) {}

  get f() :any{ return this.registerForm.controls; }

  ngOnInit(){
  this.formInit();
  }

  formInit(){
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(5),confirmPasswordValidator]],
      mobileNo: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
  }

  this._loginService.registerUser(this.registerForm.value).subscribe(resp=>{
    this.toastr.success('success', 'registration successful!');
    this.registerForm.reset();
    this.registerForm.controls.userName.setErrors(null);
    this.registerForm.controls.email.setErrors(null);
    this.registerForm.controls.password.setErrors(null);
    this.registerForm.controls.confirmPassword.setErrors(null);
    this.registerForm.controls.mobileNo.setErrors(null);
    this.registerForm.controls.role.setErrors(null);
  },err=>{
    this.toastr.error(err.error.error, 'register error');
  })
  }
  
}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
      return null;
  }

  if ( passwordConfirm.value === '' )
  {
      return null;
  }

  if ( password.value === passwordConfirm.value )
  {
      return null;
  }

  return {passwordsNotMatching: true};
};

