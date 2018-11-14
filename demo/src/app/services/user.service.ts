import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class UserService {
  url=environment.url;
  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': "Bearer "+localStorage.getItem("token")
  })
};

  constructor(private http: HttpClient, public router:Router) { }

    users:Object=[];
  getUsers(){
    return this.http.get(this.url+"api/users",this.httpOptions)
    .subscribe(data => 
      {
        this.users=data;    
      },
      ()=>{
        
      }
    )
  }
  getUser(id){
    return this.http.get(this.url+"api/users/"+id,this.httpOptions)
    .subscribe(data => 
      {
          
        this.users=data;    
      },
      ()=>{
        
      }
    )
  }
  createUser(username,password,role){
    return this.http.post(this.url+"api/users",{"username":username,"password":password,"role":role},this.httpOptions)
        .toPromise()
        .then(
            ()=>{
                this.getUsers();
            }
        )
  }
  deleteUser(id){
    return this.http.delete(this.url+"api/users/"+id,this.httpOptions)
        .toPromise()
        .then(
            ()=>{
                this.getUsers();
            }
        )
  }
}


