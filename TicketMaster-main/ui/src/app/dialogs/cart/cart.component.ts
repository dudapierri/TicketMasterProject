import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  tickets: Array<any> = [];
  constructor(
    public dialogRef: MatDialogRef<CartComponent>,
    private cartService: CartService,
    private userService: UserService,
    public dialog: MatDialog,
    private utils: UtilsService
  ) {
    this.tickets = this.cartService.getCart();
  }

  removeTicket(ticket: any) {
    this.cartService.removeTicket(ticket);
  }

  getCart() {
    return this.cartService.getCart();
  }

  getTicketsTotal() {
    const sum = this.tickets.reduce((accumulator: any, currentValue: any) => {
      return accumulator + currentValue.price;
    }, 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sum);
  }

  async buyTickets() {
    if (!this.userService.isLogged()) {
      this.userService.login();
      this.dialogRef.close();
    } else {
      const allPurchases = this.createAllPurchases("card");
      this.cartService.buyTickets(allPurchases).subscribe(
        (response: any) => {
          this.utils.showMessage(response.message);
          this.cartService.clearCart();
          this.dialogRef.close();
          window.location.reload();
        }, (error: any) => {
          this.utils.showMessage(error.error.message, true);
        }
      );
    }
  }

  userIsAdmin() {
    return this.userService.isAdmin();
  }

  createAllPurchases(paymentType: string) {
    const userId = this.userService.getUser()._id;
    return this.cartService.getCart().map((ticket: any) => ({
      userId,
      ticketId: ticket._id,
      date: new Date().toISOString(),
      paymentType
    }));
  }
}
