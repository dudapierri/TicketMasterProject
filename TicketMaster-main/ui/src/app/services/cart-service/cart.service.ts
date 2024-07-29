import { Injectable } from '@angular/core';
import { HeaderService } from '../header-service/header.service';
import { UtilsService } from '../utils-service/utils.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user-service/user.service';
import { environment } from "../../../environments/environment";

const CART_KEY = 'user-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  API_URL = environment.API_URL + "/purchase";
  cart: any = [];

  constructor(
    private utils: UtilsService,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.loadCart();
  }

  async addTicketToCart(ticket: any) {
    const totalQuantity = this.getTotalQuantityForEvent(ticket._id);
    if (totalQuantity + 1 > ticket.remaining) {
      this.utils.showMessage('Cannot add ticket to cart. Exceeds remaining capacity', true)
      return;
    }

    this.cart.push(ticket);
    this.saveCart();
  }

  removeTicket(ticket: any) {
    const index = this.cart.findIndex((cartTicket: any) => cartTicket._id === ticket._id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }

  getCart() {
    return this.cart;
  }

  getCartLength() {
    return this.cart.length;
  }

  getTotalQuantityForEvent(eventId: string): number {
    return this.cart.filter((ticket: any) => ticket._id === eventId).length;
  }


  saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);
    this.cart = savedCart ? JSON.parse(savedCart) : [];
  }

  clearCart() {
    localStorage.removeItem(CART_KEY);
    this.cart = [];
  }

  buyTickets(allPurchases: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.post<any>(`${this.API_URL}/create`, { allPurchases }, { headers });
  }

  getPurchases(userId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any[]>(`${this.API_URL}/${userId}`, { headers });
  }
}
