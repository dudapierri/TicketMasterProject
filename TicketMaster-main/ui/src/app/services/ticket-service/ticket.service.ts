import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';
import { ITicketService } from 'src/app/core/utils/Interfaces/ticket.service.interface';
 
@Injectable({
  providedIn: 'root'
})
export class TicketService implements ITicketService {
  API_URL = environment.API_URL + "/ticket";

  constructor(private http: HttpClient,
    private userService: UserService
  ) { }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  createEvent(event: any, image: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('eventDate', event.eventDate);
    formData.append('address', event.address);
    formData.append('name', event.name);
    formData.append('email', event.email);
    formData.append('price', event.price.toString());
    formData.append('capacity', event.capacity.toString());
    formData.append('image', image);

    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });

    return this.http.post<any>(`${this.API_URL}/create`, formData, { headers });
  }

  updateEvent(event: any, image: String | ArrayBuffer, id: string): Observable<any> {
    const arrayBuffer = image as ArrayBuffer;
    const imageData = new Blob([arrayBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('eventDate', event.eventDate);
    formData.append('hour', event.hour);
    formData.append('address', event.address);
    formData.append('name', event.name);
    formData.append('email', event.email);
    formData.append('price', event.price.toString());
    formData.append('capacity', event.capacity.toString());
    formData.append('image', imageData);
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });

    return this.http.put<any>(`${this.API_URL}/update/${id}`, formData, { headers });
  }

  deleteEvent(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });

    return this.http.delete<any>(`${this.API_URL}/delete/${id}`, { headers });
  }
}
