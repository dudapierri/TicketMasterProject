import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { Observable, lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TicketInfoComponent } from 'src/app/dialogs/ticket-info/ticket-info.component';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { EditEventComponent } from 'src/app/dialogs/edit-event/edit-event.component';
import { TicketProxyService } from 'src/app/services/ticket-proxy-service/ticket-proxy.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tickets$: Observable<any[]>;


  constructor(
    private headerService: HeaderService,
    private ticketService: TicketProxyService,
    public dialog: MatDialog,
    private cartService: CartService,
    private userService: UserService
  ) { 
    this.tickets$ = this.headerService.tickets$;  
  }

  async ngOnInit(): Promise<void> {
    await this.headerService.setTickets();
    this.headerService.headerData = {
      title: 'TicketMaster',
      icon: '',
      routeUrl: ''
    };
  }

  openTicketDialog(ticket: any) {
    this.dialog.open(TicketInfoComponent, { data: ticket });
  }


  addTicketToCart(ticket: any) {
    this.cartService.addTicketToCart(ticket);
  }

  editTicketEvent(ticket: any){
     if(this.userIsAdmin()){
      this.dialog.open(EditEventComponent, { data: ticket });
     }
  }

  userIsAdmin(){
    return this.userService.isAdmin();
  }

}
