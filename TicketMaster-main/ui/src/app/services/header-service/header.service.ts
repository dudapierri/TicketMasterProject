import { Injectable } from '@angular/core';
import { HeaderData } from "./header-data.model";
import { BehaviorSubject, Observable } from "rxjs";
import { lastValueFrom } from 'rxjs';
import { TicketService } from '../ticket-service/ticket.service';
import { CartService } from '../cart-service/cart.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _tickets = new BehaviorSubject<any[]>([]);

  _headerData = new BehaviorSubject<HeaderData>({
    title: 'Tickets',
    icon: '',
    routeUrl: ''
  })

  constructor(private ticketService: TicketService) {
  }

  get headerData(): HeaderData {
    return this._headerData.value
  }

  set headerData(headerData: HeaderData) {
    this._headerData.next(headerData)
  }

  get tickets$(): Observable<any[]> {
    return this._tickets.asObservable();
  }

  async setTickets() {
    const response: any = await lastValueFrom(this.ticketService.getTickets());
    if (!response.error) {
      let tickets = response.result.tickets;
      this._tickets.next(tickets);
    }
  }
 


}
