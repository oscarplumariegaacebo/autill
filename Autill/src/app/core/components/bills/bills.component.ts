import { Component, inject, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common-service.service';
import { BillService } from '../../services/bill.service';
import { ClientService } from '../../services/client.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [PaginatorComponent],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent {
  @Input() bills: any;
  
  allBills: any = [];
  billService = inject(BillService);
  clientService = inject(ClientService);
  errorMessage: string = "";

  constructor(private dialog: MatDialog, public commonService: CommonService) {}

  ngOnInit() {
    this.billService.getBills().subscribe({
      next: (data:any) => {
        for (let i = 0; i < data.length; i++) {
          this.clientService.getClients().subscribe((clients:any) =>{
            for (let x = 0; x < clients.length; x++) {
              if(clients[x].id === data[i].clientId) {
                data[i].clientName = clients[x].name;
              }
            }
          })
        }
        this.allBills = data;
        this.bills = data.slice(0,10);
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

  updateItems(bills: any){
    this.bills = bills;
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
