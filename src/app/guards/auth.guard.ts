import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {  CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '@services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenService,
    private router: Router
    ){}
  // Investigar mas esto de programacion modular 
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  //Se ivalido esto porque se valida el token 
  /**Si consigue el token entonces regresa true  */ 
  // canActivate(): boolean {

  //   const token = this.tokenService.isValidToken();

  //   if (!token) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   return true;
  // }
  
//Se invalida esto porque ahora durara lo que dure el refresToken
  // canActivate(): boolean {
  //   const isValidToken = this.tokenService.isValidToken();
  //   console.log('isValidToken from AuthGuard ', isValidToken);
  //   if (!isValidToken) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   return true;
  // }

  canActivate(): boolean {
    const isValidToken = this.tokenService.isValidRefreshToken();
    console.log('isValidToken from AuthGuard ', isValidToken);
    if (!isValidToken) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }


}
