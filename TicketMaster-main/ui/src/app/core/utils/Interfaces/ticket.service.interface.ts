import { Observable } from 'rxjs';
 
export interface ITicketService {
  getTickets(): Observable<any[]>;
  createEvent(event: any, image: Blob): Observable<any>;
  updateEvent(event: any, image: String | ArrayBuffer, id: string): Observable<any>;
  deleteEvent(id: string): Observable<any>;
}