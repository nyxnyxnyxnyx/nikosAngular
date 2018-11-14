import { Injectable } from '@angular/core';
import { CanActivate, Router }    from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public router:Router) { }
  loggedIn=false;
  canActivate(){
    if(localStorage.getItem("token")){
      this.loggedIn=true;
      return true;
      
    }else{
      this.router.navigate(["/login"]);
      this.loggedIn=false;
      return false;
    }
  }
}
