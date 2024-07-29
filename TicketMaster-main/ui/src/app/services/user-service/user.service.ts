// user.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/dialogs/login/login.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { IUserService } from 'src/app/core/utils/Interfaces/user.service.interface';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  API_URL = environment.API_URL + "/auth";
  private static currentUser: any = null;
  private static currentToken: string | null = null;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) { }

  cleanStorage(): void {
    console.log('Cleaning storage...');
    window.sessionStorage.clear();
    UserService.currentUser = null;
    UserService.currentToken = null;
    console.log('Current user after clean:', UserService.currentUser);
    console.log('Current token after clean:', UserService.currentToken);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    UserService.currentUser = user.user;
    UserService.currentToken = user.token;
  }

  public getUser(): any {
    if (UserService.currentUser) {
      return UserService.currentUser;
    }
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      UserService.currentUser = JSON.parse(user).user;
      return UserService.currentUser;
    }
    return null;
  }

  public getToken(): any {
    if (UserService.currentToken) {
      return UserService.currentToken;
    }
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      UserService.currentToken = JSON.parse(user).token;
      return UserService.currentToken;
    }
    return null;
  }

  public isLogged(): boolean {
    return !!this.getUser();
  }

  login() {
    this.dialog.open(LoginComponent, {});
  }

  logout() {
    this.cleanStorage();
    window.location.reload();
  }

  public isAdmin() {
    const user = this.getUser() || {};
    return user?.isAdmin || false;
  }

  updateUser(user: any, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`,
    });

    return this.http.put<any>(`${this.API_URL}/update/${id}`, user, { headers });
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`,
    });
    return this.http.post<any>(`${this.API_URL}/change-password`, { email, oldPassword, newPassword }, { headers });
  }

  register(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`,
    });
    return this.http.post<any>(`${this.API_URL}/register`, user, { headers });
  }
}
