import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetModalComponent } from '../../../shared/components/budget-modal/budget-modal.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [BudgetModalComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  budgets:any = [];
  showModal = false;

  constructor(private service: ApiService, private dialog: MatDialog){}

  ngOnInit() {
    this.service.getBudgets().subscribe((data:any) => {
      this.budgets = data;
    })
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(BudgetModalComponent);

    /* 
      Handles what happens after the modal dialog is closed
    */
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }
}
