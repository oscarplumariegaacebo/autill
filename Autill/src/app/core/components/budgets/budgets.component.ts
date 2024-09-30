import { Component, inject, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetModalComponent } from '../../../shared/components/budget-modal/budget-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { ErrorsComponent } from "../../../shared/components/errors/errors.component";
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { CommonService } from '../../services/common-service.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatButton, ErrorsComponent, MatPaginatorModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  budgets: any = [];
  showModal = false;
  apiService = inject(ApiService);
  budgetService = inject(BudgetService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog, public commonService: CommonService) { }

  ngOnInit() {
    this.budgetService.getBudgets().subscribe({
      next: (data: any) => {
        this.budgets = data;
      },
      error: (err: HttpErrorResponse) => {
        let error = '';
        if (err.status === 500) {
          error = 'Internal server error.'
        } else if (err.status === 401) {
          error = 'No autorizado.'
        } else {
          error = 'Ha ocurrido un error, contacta con el administrador.'
        }
        this.errorMessage = error;
      }
    })
  }

  openTaskDialog(action: string, id: number) {
    const dialogRef = this.dialog.open(BudgetModalComponent);
    dialogRef.componentInstance.id = id;
    dialogRef.componentInstance.action = action;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }

  deleteBudget(id: number) {
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'el presupuesto'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.budgetService.deleteBudget(id).subscribe({
        })
      }
    })
  }

  }