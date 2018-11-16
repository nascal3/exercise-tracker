import {UserModel} from './user.model';
import {AuthDataModel} from './auth-data.model';

export class AuthService {
  private user: UserModel;

  registerUser(authData: AuthDataModel) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }

  login(authData: AuthDataModel) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }

  logout() {
    this.user = null;
  }

  getUser() {
    return {...this.user};
  }

  isAuth() {
    return this.user != null;
  }
}
