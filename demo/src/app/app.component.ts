import { AuthGuardService } from './services/auth-guard.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

export class AppComponent {
  constructor(public auth:AuthGuardService,public router:Router){
  
  }
  logout(){
    localStorage.removeItem("token");
    this.auth.loggedIn=false;
    this.router.navigate(["/login"]);
  }
}
