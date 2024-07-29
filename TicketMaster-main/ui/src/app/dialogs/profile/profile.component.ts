import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = null;
  name: any = null;
  cpf: any = null;
  email: any = null;
  phone: any = null;
  oldPassword: any = null;
  newPassword: any = null;
  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    private userService: UserService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.initUser();
  }

  initUser() {
    this.user = this.userService.getUser();
    this.name = this.user.name || "";
    this.email = this.user.email || "";
    this.cpf = this.user.cpf || "";
    this.phone = this.user.phone || "";
  }

  updateUser() {
    const updatedUser = {
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone
    };

    this.userService.updateUser(updatedUser, this.user._id).subscribe(
      (response: any) => {
        const token = this.userService.getToken();
        this.userService.saveUser({ token, user: response.result.user });
        this.utils.showMessage('User updated successfully', false);
        this.dialogRef.close();
      }, (error) => {
        this.utils.showMessage('Error updating user', true);
      }
    );
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]).{8,}/;
    return passwordRegex.test(password);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changePassword() {
    if (this.oldPassword && this.newPassword && this.validatePassword(this.newPassword)) {
      this.userService.changePassword(this.email, this.oldPassword, this.newPassword).subscribe(
        (response: any) => {
          this.utils.showMessage('Password changed successfully', false);
          this.dialogRef.close();
        }, (error) => {
          this.utils.showMessage(error.error.message, true);
          this.dialogRef.close();
        }
      );
    } else {
      if(!this.validatePassword(this.newPassword)){
        this.utils.showMessage(`New password is required and must be 8-30 characters long, 
        including at least one lowercase letter, one uppercase letter, one number, and one special character`, true);

      } else {
        this.utils.showMessage('Old password and new password are required', true);
      }
    }
  }
}