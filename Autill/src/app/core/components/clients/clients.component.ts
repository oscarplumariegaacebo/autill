import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { ClientsModalComponent } from '../../../shared/components/clients-modal/clients-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatButton, ErrorsComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  clients:any = [];
  showModal = false;
  apiService = inject(ApiService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.apiService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
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

  deleteClient(id: number){
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'el cliente'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'confirm'){
        this.apiService.deleteClient(id).subscribe({
        })
      }
    })
  }

  openTaskDialog(id: number) {
    const dialogRef = this.dialog.open(ClientsModalComponent);
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }
}
