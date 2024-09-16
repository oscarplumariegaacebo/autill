import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemModalComponent } from '../../../shared/components/item-modal/item-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [ErrorsComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  items:any = [];
  showModal = false;
  apiService = inject(ApiService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.apiService.getItems().subscribe((items:any) => {
      this.items = items;
    })
  }

  openTaskDialog(action:string, id: number) {
    const dialogRef = this.dialog.open(ItemModalComponent);
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }

  deleteItem(id:number){
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'presupuesto'

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'confirm'){
        this.apiService.deleteBudget(id).subscribe({
        })
      }
    })
  }
}
