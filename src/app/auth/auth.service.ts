import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {UserModel} from './user.model';
import {AuthDataModel} from './auth-data.model';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthDataModel) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
        console.log(result);
        this.authSuccessfully();
      }).catch( error => {
        console.log(error);
    });
  }

  login(authData: AuthDataModel) {
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.authSuccessfully();
    }).catch( error => {
      console.log(error);
    });
    this.authSuccessfully();
  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = true;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
