import { Component, inject, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetModalComponent } from '../../../shared/components/budget-modal/budget-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { ErrorsComponent } from "../../../shared/components/errors/errors.component";
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { CommonService } from '../../services/common-service.service';
import { BudgetService } from '../../services/budget.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatButton, ErrorsComponent, PaginatorComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  @Input() budgets: any;
  
  allBudgets: any = [];
  showModal = false;
  apiService = inject(ApiService);
  budgetService = inject(BudgetService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog, public commonService: CommonService) { }

  ngOnInit() {
    this.budgetService.getBudgets().subscribe({
      next: (data: any) => {
        this.allBudgets = data;
        this.budgets = data.slice(0,10);
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

  updateItems(budgets: any){
    this.budgets = budgets;
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