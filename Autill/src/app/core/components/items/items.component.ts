import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemModalComponent } from '../../../shared/components/item-modal/item-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';
import { ItemService } from '../../services/item.service';

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
  itemService = inject(ItemService);
  errorMessage: string = '';

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.itemService.getItems().subscribe((items:any) => {
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
    dialogRef.componentInstance.type = 'el producto'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
