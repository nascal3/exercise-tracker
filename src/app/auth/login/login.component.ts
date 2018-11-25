import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean>;
  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<{ui: fromRoot.State}>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoaidng);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
  }

}
