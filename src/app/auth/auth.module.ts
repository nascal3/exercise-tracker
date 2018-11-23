import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { SharedModule } from '../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';

import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    AngularFireAuthModule,
    SharedModule,
    AuthRoutingModule
  ],
  exports: []
})
export class AuthModule {}
