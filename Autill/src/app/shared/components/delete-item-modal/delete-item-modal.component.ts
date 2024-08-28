import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-item-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-item-modal.component.html',
  styleUrl: './delete-item-modal.component.css'
})
export class DeleteItemModalComponent {

  constructor(public dialogRef: MatDialogRef<DeleteItemModalComponent>) {
  }
  onClose(): void {
    this.dialogRef.close();
  }
  confirm(){
    this.dialogRef.close('confirm');
  }

}
