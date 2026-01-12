// import { Component,OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
// import { User } from '@models/user.model';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
// export class NavbarComponent implements OnInit{
 export class NavbarComponent {

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;

  user$=this.authService.user$;

// El usuario es nulo , mientras se hace la peticion 
  // user:User |null =null;

  constructor(
    private authService: AuthService,
    private router :Router
  ) {}

  //Ya no se va a ocupar porque solicita esa informacion desde layout.component
  // ngOnInit(): void {
  //   this.authService.getProfile()
  //   .subscribe(user =>{
  //     this.user=user;  
  //   })
  // }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
