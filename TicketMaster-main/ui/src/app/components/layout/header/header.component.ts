import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from 'src/app/dialogs/cart/cart.component';
import { CreateEventComponent } from 'src/app/dialogs/create-event/create-event.component';
import { ProfileComponent } from 'src/app/dialogs/profile/profile.component';
import { UserTicketsComponent } from 'src/app/dialogs/user-tickets/user-tickets.component';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserProxyService } from 'src/app/services/user-proxy-service/user-proxy.service';
import { UserService } from 'src/app/services/user-service/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {



  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private cartService: CartService,
    private userProxyService: UserProxyService) {
  }


  ngOnInit() {
  }


  createEvent() {
    this.dialog.open(CreateEventComponent, {});
  }

  openProfile() {
    this.dialog.open(ProfileComponent, {});

  }

  openCart() {
    this.dialog.open(CartComponent, {});
  }

  isLogged() {
    return this.userProxyService.isLogged();
  }

  logout() {
    this.userProxyService.logout();
  }

  login() { 
    this.userProxyService.login();
  }

  get title(): string {
    return this.headerService.headerData.title
  }

  get icon(): string {
    return this.headerService.headerData.icon
  }

  get routeUrl(): string {
    return this.headerService.headerData.routeUrl
  }

  getCartLength() {
    return this.cartService.getCartLength();
  }


  userIsAdmin(){
    return this.userProxyService.isAdmin();
  }

  openUserTickets(){
    this.dialog.open(UserTicketsComponent, {
      data: {
        userId: this.userProxyService.getUser()._id
      }
    });
  }

}
