import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, switchMap ,tap} from 'rxjs';   // s una libreria que que permite anidar observables y cancelar y actuali
//el observable si el mas anidado cambia
import { checkToken } from '@interceptors/token.interceptor';

import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl=environment.API_URL;

  user$=new BehaviorSubject<User|null> (null);


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**El email y el password serian parte del body que se 
   * mandara en formato json    */
  // login(email:string , password:string){
  //   return this.http.post(`${this.apiUrl}/api/v1/auth/login`,{
  //     email,
  //     password
  //   });
  // }

  
 login(email:string , password:string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`,{
      email,
      password
    })
    //Tener el pipe aqui no afecta al flujo del metodo , el va a ser regresar
    //su return normal  aqui solo se le pide que haga ese trabajo extra.
    .pipe(
      tap(response => {
        // esto es para que valla y guarde el token 
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token); //////////////////////77
        
      })
    );
  }




  register(name: string, email: string, password: string,) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {
      name,
      email,
      password
    });
  }




  isAvailable(email: string) {
    //<{isAvailable: boolean}> con eso decimos que sera de tipo json y 
    //que tiene una variable 
    //isAvailable
    return this.http.post<{isAvailable: boolean}>(`${this.apiUrl}/api/v1/auth/is-available`, {email});
  }


  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password)
    .pipe(
      switchMap(() => this.login(email, password))
    );
  }


  /**Los siguiente 2 metodos son para la recuperacion 
   * de la contraseña 
   */

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`, { email });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`, { token, newPassword });
  }


  logout (){
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }




  // getProfile() {
  //   const token = this.tokenService.getToken();
  //   return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }


// /**
//  * 
//  * @returns un observable de la informacion de un usuario , se puso 
//  * un pipe extra 
//  */
//   getProfile() {
//     const token = this.tokenService.getToken();
//     return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }).pipe(
//       tap(user => {
//         this.user$.next(user);
//       })
//     );
//   }



/**
 * 
 * @returns un observable de la informacion de un usuario , se puso 
 * un pipe extra 
 */
getProfile() {
  
  return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, {context:checkToken() }).pipe(
    tap(user => {
      this.user$.next(user);
    })
  );
}





/**
 * Al hacer esto pertemos reactividad si es que hacemos un cambio en el
 * user no se va a transmiter , pero en ocaciones no requerimos eso en tiempo real 
 * @returns 
 */
  getDataUser(){
    return this.user$.getValue();
  }



/**Endpoint de refreshToken
 * 
 * @param refreshToken 
 * @returns 
 */
  refreshToken(refreshToken: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/refresh-token`, {refreshToken})
    .pipe(
      tap(response => {

        //tenemos que volver a guardar los valores porque este endpoint genera nuevos 
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );;
  }



}

