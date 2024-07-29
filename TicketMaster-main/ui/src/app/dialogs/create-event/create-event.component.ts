import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TicketProxyService } from 'src/app/services/ticket-proxy-service/ticket-proxy.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  imageData: Blob | null = null;
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
  constructor(public dialogRef: MatDialogRef<CreateEventComponent>,
    private utils: UtilsService,
    private ticketService: TicketProxyService
  ) { }


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
          const arrayBuffer = reader.result as ArrayBuffer;
          this.imageData = new Blob([arrayBuffer], { type: selectedFile.type });
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

  createEvent() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.title && this.description && this.date && this.hour && this.address && this.name
      && this.email && emailRegex.test(this.email) && this.price > 0 && this.imageData && this.capacity > 0) {
      const eventDate = new Date(this.date);
      const [hours, minutes] = this.hour.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      const now = new Date();

      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      if (eventDate >= threeDaysFromNow) {
        this.ticketService.createEvent({
          title: this.title,
          description: this.description,
          address: this.address,
          eventDate: eventDate,
          name: this.name,
          email: this.email,
          price: this.price,
          capacity: this.capacity
        }, this.imageData).subscribe(
          (response: any) => {
            this.utils.showMessage(response.result.message);
            this.closeDialog();
            window.location.reload();
          }, (error: any) => {
            this.utils.showMessage(error.error.message, true);
            this.closeDialog();
          }
        );
      } else {
        this.utils.showMessage("The event date must be at least 3 days from now", true);
      }
    } else {
      if (!this.title || !this.description || !this.date || !this.hour || !this.address || !this.name || !this.email || !this.price || !this.imageData || !this.capacity) {
        this.utils.showMessage("All fields must be filled out", true);
      } else if (!emailRegex.test(this.email)) {
        this.utils.showMessage("Please enter a valid email address", true);
      }
    }
  }
}
