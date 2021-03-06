import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  userProfile: any;

  idToken;

  auth0 = new auth0.WebAuth({
    clientID: 'Fm291VvLyWt5V48H5OQCUzn4dKO7NSVA',
    domain: 'isis2503-jdtrujillom.auth0.com',
    responseType: 'token id_token',
    audience: 'https://isis2503-jdtrujillom.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  });

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public token(): String {
    return this.idToken;
  } 
 
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        
          this.getProfile((err, profile) => {
            this.userProfile = profile;
            console.log(this.getIdUnidadResidencial());
          });
        
          
        
        this.router.navigate(['/mapa']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  public userProfi(): any {
    return this.userProfile;
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public loadToken(): String {
    return localStorage.getItem('id_token');
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    this.idToken = localStorage.getItem('id_token');
    console.log(accessToken);
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }
  
    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
        console.log(this.userProfile);
      }
      cb(err, profile);
    });

  }

  public getIdUnidadResidencial(){
      return this.userProfile['http://elay/user_metadata'].idUnidadResidencial;
  };

}