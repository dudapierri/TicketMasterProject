import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrls: ['./ticket-info.component.css']
})
export class TicketInfoComponent {
  ticket: any = null;
  constructor(
    public dialogRef: MatDialogRef<TicketInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.ticket = data;
    console.log(data)
  } 

  getEmail(){
    return this.ticket.email;
  }

  getName(){
    return this.ticket.name;
  }

  formatDateAndTime(isoDate: any) {
    const date = new Date(isoDate);
  
    const dateOptions: any = {
      weekday: 'short', 
      day: 'numeric',   
      month: 'long',    
      year: 'numeric' 
    };
  
    const timeOptions: any = {
      hour: 'numeric',  
      minute: '2-digit', 
      hour12: true    
    };
  
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  
    return {
      date: formattedDate,
      hour: formattedTime
    };
  }

}