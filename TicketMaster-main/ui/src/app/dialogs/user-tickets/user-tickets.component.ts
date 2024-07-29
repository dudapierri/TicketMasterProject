import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart-service/cart.service';

@Component({
  selector: 'app-user-tickets',
  templateUrl: './user-tickets.component.html',
  styleUrls: ['./user-tickets.component.css']
})
export class UserTicketsComponent {

  purchases: any[] = [];

  constructor(
    private cartService: CartService,
    public dialogRef: MatDialogRef<UserTicketsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {}

  ngOnInit(): void {
    this.cartService.getPurchases(this.data.userId).subscribe(
      (data: any) => {
        console.log(data)
        this.purchases = data.result.purchases;
      },
      (error) => {
        console.error('Failed to fetch purchases', error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
