import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent {
  bills: any = [];
  apiService = inject(ApiService);
  errorMessage: string = "";

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.apiService.getBills().subscribe({
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
        this.bills = data;
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

  openTaskDialog(n:string, id:number){

  }

  deleteBill(id: number) {
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'la factura'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
    })
  }

}
