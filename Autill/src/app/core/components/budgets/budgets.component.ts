import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BudgetModalComponent } from '../../../shared/components/budget-modal/budget-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { ErrorsComponent } from "../../../shared/components/errors/errors.component";

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatButton, ErrorsComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  budgets:any = [];
  showModal = false;
  apiService = inject(ApiService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.apiService.getBudgets().subscribe({
      next: (data:any) => {

        for (let i = 0; i < data.length; i++) {
          this.apiService.getClients().subscribe((clients:any) =>{
            for (let x = 0; x < clients.length; x++) {
              if(clients[x].id === data[i].clientId) {
                data[i].clientName = clients[x].name;
              }
            }
          })
        }
        this.budgets = data;
      }, 
      error: (err: HttpErrorResponse) => {
        let error = '';
        if(err.status === 500){
          error = 'Internal server error.'
        }else if(err.status === 401){
          error = 'No autorizado.'
        }else{
          error = 'Ha ocurrido un error, contacta con el administrador.'
        }
        this.errorMessage = error;
      }
    })
  }

  openTaskDialog(id: number) {
    const dialogRef = this.dialog.open(BudgetModalComponent);
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }

  deleteBudget(id:number){
    this.apiService.deleteBudget(id).subscribe({

    })
  }
}
