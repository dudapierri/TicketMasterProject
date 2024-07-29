import { Injectable } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { Observable } from 'rxjs';
import { ITicketService } from 'src/app/core/utils/Interfaces/ticket.service.interface';
import { TicketService } from '../ticket-service/ticket.service';
import { UtilsService } from '../utils-service/utils.service';

@Injectable({
  providedIn: 'root'
})
export class TicketProxyService implements ITicketService {
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private utils: UtilsService
  ) { }

  getTickets(): Observable<any[]> {
    return this.ticketService.getTickets();
  }

  createEvent(event: any, image: Blob): any {
    if (this.userService.isAdmin()) {
      return this.ticketService.createEvent(event, image);
    } else {
      console.log('Access denied. Only admins can create events.');
      this.utils.showMessage('Access denied. Only admins can create events.', true);
    }
  }

  updateEvent(event: any, image: String | ArrayBuffer, id: string): any {
    if (this.userService.isAdmin()) {
      return this.ticketService.updateEvent(event, image, id);
    } else {
      console.log('Access denied. Only admins can update events.');
      this.utils.showMessage('Access denied. Only admins can update events.', true);
    }
  }

  deleteEvent(id: string): any {
    if (this.userService.isAdmin()) {
      return this.ticketService.deleteEvent(id);
    } else {
      console.log('Access denied. Only admins can delete events.');
      this.utils.showMessage('Access denied. Only admins can delete events.', true);
    }
  }
}
