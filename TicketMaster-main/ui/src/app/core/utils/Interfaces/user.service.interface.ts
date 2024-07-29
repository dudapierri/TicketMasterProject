import { Observable } from "rxjs";

export interface IUserService {
    cleanStorage(): void;
    saveUser(user: any): void;
    getUser(): any;
    getToken(): any;
    isLogged(): boolean;
    login(): void;
    logout(): void;
    isAdmin(): boolean;
    updateUser(user: any, id: string): Observable<any>;
    changePassword(email: string, oldPassword: string, newPassword: string): Observable<any>;
    register(user: any): Observable<any>;
  }