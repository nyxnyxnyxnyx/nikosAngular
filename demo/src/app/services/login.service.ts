import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoginService {
  url=environment.url;
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': "Bearer "+localStorage.getItem("token")
  })
};

  constructor(private http: HttpClient, public router:Router,private toastr: ToastrService) { }
  user:Object=[];
  login(data) {
    return this.http.post(this.url+"auth/signin",data)
    .subscribe(data => 
    {
      localStorage.setItem("token",data['token']);      
      this.router.navigate(['/dashboard']);     
    },
    ()=>{
      this.toastr.error('Error', "Usuario o contraseña incorrectos");
    }
    );
  }
  getUserData(){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': "Bearer "+localStorage.getItem("token")
      })
    };
    return this.http.get(this.url+"api/users/me",this.httpOptions)

  }
}


