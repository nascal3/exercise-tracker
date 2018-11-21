import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {UserModel} from './user.model';
import {AuthDataModel} from './auth-data.model';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material';
import {UiService} from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uiService: UiService
    ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthDataModel) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
        // console.log(result);
        this.uiService.loadingStateChanged.next(false);
      }).catch( error => {
        this.snackbar.open(error.message, null, {duration: 3000});
        this.uiService.loadingStateChanged.next(false);
    });
  }

  login(authData: AuthDataModel) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      // console.log(result);
      this.uiService.loadingStateChanged.next(false);
    }).catch( error => {
      this.uiService.loadingStateChanged.next(false);
      this.snackbar.open(error.message, null, {duration: 3000});
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
