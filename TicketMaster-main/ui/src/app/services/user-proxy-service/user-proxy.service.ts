import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserService } from 'src/app/core/utils/Interfaces/user.service.interface';
import { UserService } from '../user-service/user.service';
import { UtilsService } from '../utils-service/utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserProxyService implements IUserService {
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private http: HttpClient,
    private utils: UtilsService
  ) { }

  cleanStorage(): void {
    this.userService.cleanStorage();
  }

  saveUser(user: any): void {
    this.userService.saveUser(user);
  }

  getUser(): any {
    return this.userService.getUser();
  }

  getToken(): any {
    return this.userService.getToken();
  }

  isLogged(): boolean {
    return this.userService.isLogged();
  }

  login(): void {
    this.userService.login();
  }

  logout(): void {
    this.userService.logout();
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  updateUser(user: any, id: string): any {

    return this.userService.updateUser(user, id);
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.userService.changePassword(email, oldPassword, newPassword);
  }

  register(user: any): any {
    return this.userService.register(user);
  }
}
