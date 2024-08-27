import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-budget-modal',
  standalone: true,
  imports: [],
  templateUrl: './budget-modal.component.html',
  styleUrl: './budget-modal.component.css'
})
export class BudgetModalComponent {

  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
