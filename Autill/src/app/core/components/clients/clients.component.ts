import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { ClientsModalComponent } from '../../../shared/components/clients-modal/clients-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';
import { ClientService } from '../../services/client.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { SearchFiltersComponent } from '../../../shared/components/search-filters/search-filters.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatButton, ErrorsComponent, PaginatorComponent, SearchFiltersComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  @Input() clients: any;

  dataScreen: string = 'clients'
  allClients:any = [];
  showModal = false;
  clientService = inject(ClientService);
  errorMessage: string = '';
  dataClients: any = [];

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (data:any) => {
        this.allClients = data;
        this.dataClients = data;
        this.clients = data.slice(0,10);
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

  updateItems(clients: any){
    this.clients = clients;
  }

  updateSearching(formControlValue: any){
    this.clients = this.dataClients;

    for(let k in formControlValue){
      if(formControlValue[k] !== null && formControlValue[k] !== ''){
        if(k === 'name'){
          this.clients = this.clients.filter((item:any) => item.name.includes(formControlValue[k]));
        }else if(k === 'clientId'){
          this.clients = this.clients.filter((item:any) => item.clientName === formControlValue[k]);
        }else if(k === 'status'){
          this.clients = this.clients.filter((item:any) => item.closeIt === formControlValue[k]);
        }
      }
    }

    this.allClients = this.clients;
  }

  deleteClient(id: number){
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'el cliente'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'confirm'){
        this.clientService.deleteClient(id).subscribe({
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
