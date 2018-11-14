import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData={
    username:"",
    password:""
  }
  constructor(public loginService:LoginService) { 
    this.emailFormEx = new FormControl('', Validators.email);
    this.passwordFormEx = new FormControl('', Validators.required);
    this.noValidation = new FormControl('', Validators.required);
    this.noSuccessValidation = new FormControl('', Validators.required);
    this.noErrorValidation = new FormControl('', Validators.required);
    this.customMessages = new FormControl('', Validators.required);
  }

  emailFormEx: FormControl;
  passwordFormEx: FormControl;
  noValidation: FormControl;
  noSuccessValidation: FormControl;
  noErrorValidation: FormControl;
  customMessages: FormControl;
  errorMessage = 'Custom error message';

  ngOnInit() {
    this.loginService.getUserData();
  }

  login(){
    
    this.loginService.login(this.loginData)

    
  }

}
