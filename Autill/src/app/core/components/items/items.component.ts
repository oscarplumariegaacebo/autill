import { Component, inject, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemModalComponent } from '../../../shared/components/item-modal/item-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/Item';

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
  pageSize = 10;
  actualPage = 1;
  allItems: any = [];

  displayedColumns: string[] = ['name', 'price', 'actions'];

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.itemService.getItems().subscribe((items:any) => {
      this.allItems = items;
      this.items.push({actualPage: this.actualPage});
      this.items = items.slice(0,this.pageSize);
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

  nextPage(actualPage: number){
    this.items.actualPage = actualPage+1;
    this.items = this.allItems.slice(this.pageSize, this.pageSize*(actualPage+1)); 
  }

  previousPage(actualPage: number){
    this.items.actualPage = actualPage-1;
    this.items = this.allItems.slice(actualPage-1, this.pageSize); 
  }

  deleteItem(id:number){
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'el producto'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
