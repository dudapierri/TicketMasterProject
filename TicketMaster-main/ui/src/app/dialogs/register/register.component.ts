import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = "";
  email: string = "";
  cpf: string = "";
  phone: string = "";
  password: string = "";
  confirmPassword: string = "";
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    private utils: UtilsService,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateCPF(cpf: string): boolean {
    const cpfRegex = /^\d{11}$/;
    return cpfRegex.test(cpf);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]).{8,}/;
    return passwordRegex.test(password);
  }

  validateFields(): boolean {
    if (!this.name.trim()) {
      this.utils.showMessage('Name is required', true);
      return false;
    }
    if (!this.email.trim() || !this.validateEmail(this.email)) {
      this.utils.showMessage('A valid email is required', true);
      return false;
    }
    if (!this.cpf.trim() || !this.validateCPF(this.cpf)) {
      this.utils.showMessage('A valid CPF is required (e.g., 123.456.789-00)', true);
      return false;
    }
    if (!this.phone.trim() || !this.validatePhone(this.phone)) {
      this.utils.showMessage('A valid phone number is required (e.g., (12) 34567-8901)', true);
      return false;
    }
    if (!this.password.trim() || !this.validatePassword(this.password)) {
      this.utils.showMessage(`Password is required and must be 8-30 characters long, 
      including at least one lowercase letter, one uppercase letter, one number, and one special character`, true);
      return false;
    }

    if (this.password.trim() !== this.confirmPassword.trim()) {
      this.utils.showMessage(`Passwords do not match`, true);
      return false;
    }
    return true;
  }

  async register() {
    if (!this.validateFields()) {
      return;
    }
    const user = {
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone,
      password: this.password,
      isAdmin: false
    };

    this.userService.register(user).subscribe((response: any) => {
      this.utils.showMessage('User registered successfully', false);
      this.dialogRef.close();
    }, (error: any) => {
      this.utils.showMessage(error.error.message, true);
    }
    );
  }
}
