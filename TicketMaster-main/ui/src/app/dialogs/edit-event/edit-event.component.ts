import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils-service/utils.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TicketProxyService } from 'src/app/services/ticket-proxy-service/ticket-proxy.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  ticket: any = null;
  imageData: String | ArrayBuffer | null = null;
  selectedFileName: string | undefined;

  price: number = 0;
  title: any = null;
  description: any = null;
  date: any = null;
  hour: any = null;
  address: any = null;
  name: any = null;
  email: any = null;
  capacity: any = null;
  remaining: any = null;

  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService,
    private eventService: TicketProxyService,
    public dialog: MatDialog
  ) {
    this.ticket = data;
    console.log(this.ticket)
  }


  ngOnInit() {
    this.initEvent();
  }

  initEvent() {
    const { isoDate, time } = this.formatDateTime(this.ticket.eventDate);
    this.title = this.ticket.title || null;
    this.description = this.ticket.description || null;
    this.date = isoDate || null;
    this.hour = time || null;
    this.address = this.ticket.address || null;
    this.name = this.ticket.name || null;
    this.email = this.ticket.email || null;
    this.price = this.ticket.price.toString() || 0;
    this.capacity = this.ticket.capacity.toString() || 0;
    this.remaining = this.ticket.remaining.toString() || 0;
    this.selectedFileName = this.ticket.image64 ? "eventImage.png" : undefined;
    this.imageData = this.ticket.image64 || null;
  }

  formatDateTime(dateTimeString: any) {
    const date = new Date(dateTimeString);
    const isoDate = date.toISOString();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return {
      isoDate: isoDate,
      time: formattedTime
    };
  }

  deleteSelectedImage() {
    this.imageData = null;
    this.selectedFileName = undefined;
    const fileInput = document.getElementById('customFileInput') as HTMLInputElement;
    fileInput.value = '';
  }

  handleFileInputChange(event: any) {
    const fileInput = event.target;
    const selectedFiles = fileInput.files;
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];

      if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageData = reader.result;
        };
        reader.readAsDataURL(selectedFile);
        this.selectedFileName = selectedFile.name;
      } else {
        this.utils.showMessage('Please select a PNG or JPEG file', true);
        this.selectedFileName = undefined;
        this.imageData = null;
      }
    } else {
      this.selectedFileName = undefined;
      this.imageData = null;
    }
  }

  updatePrice(event: any) {
    const newValue = event.value;
    if (!isNaN(newValue)) {
      this.price = newValue;
    } else {
      this.price = 0;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteEvent() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Confirm Delete",
        message: 'Are you sure you want to delete this event?'
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.ticket && this.ticket._id) {
          this.eventService.deleteEvent(this.ticket._id).subscribe(
            (response: any) => {
              console.log(response.message);
              this.utils.showMessage('Event deleted successfully', false);
              this.closeDialog();
              window.location.reload();
            },
            (error: any) => {
              console.error(error.message);
              this.utils.showMessage('Failed to delete event', true);
              this.closeDialog();
            }
          );
        } else {
          this.utils.showMessage('Invalid event data', true);
          this.closeDialog();
        }
      }
    });
  }

  updateEvent() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.title && this.description && this.date && this.hour && this.address && this.name && this.email && emailRegex.test(this.email) && this.price > 0 && this.imageData &&
      this.capacity > 0 && Number(this.capacity) >= Number(this.remaining)) {
      const eventDate = new Date(this.date);
      const [hours, minutes] = this.hour.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      const now = new Date();

      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      if (eventDate >= threeDaysFromNow) {
        this.eventService.updateEvent({
          title: this.title,
          description: this.description,
          address: this.address,
          eventDate: eventDate,
          name: this.name,
          email: this.email,
          price: this.price,
          capacity: this.capacity
        }, this.imageData, this.ticket._id).subscribe(
          (response: any) => {
            this.utils.showMessage(response.message);
            this.closeDialog();
            window.location.reload();
          }, (error: any) => {
            this.utils.showMessage(error.message, true);
            this.closeDialog();
          }
        );
      } else {
        this.utils.showMessage("The event date must be at least 3 days from now", true);
      }
    } else {
      if (!this.title || !this.description || !this.date || !this.hour || !this.address || !this.name || !this.email || !this.price || !this.imageData) {
        this.utils.showMessage("All fields must be filled out", true);
      } else if (!emailRegex.test(this.email)) {
        this.utils.showMessage("Please enter a valid email address", true);
      } else if (Number(this.capacity) < Number(this.remaining)) {
        this.utils.showMessage("the capacity must be greater than the remaining", true);
      } 
    }
  }
}

