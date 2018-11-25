import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {AuthDataModel} from './auth-data.model';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<{ui: fromApp.State}>
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
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({type: 'START_LOADING'});
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
        // console.log(result);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({type: 'STOP_LOADING'});
      }).catch( error => {
        this.uiService.showSnackbar(error.message, null, 3000);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({type: 'STOP_LOADING'});
    });
  }

  login(authData: AuthDataModel) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({type: 'START_LOADING'});
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      // console.log(result);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STOP_LOADING'});
    }).catch( error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STOP_LOADING'});
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
