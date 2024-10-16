import { Component, inject, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DeleteItemModalComponent } from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemModalComponent } from '../../../shared/components/item-modal/item-modal.component';
import { ErrorsComponent } from '../../../shared/components/errors/errors.component';
import { ItemService } from '../../services/item.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { SearchFiltersComponent } from '../../../shared/components/search-filters/search-filters.component';
import { CommonService } from '../../services/common-service.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [ErrorsComponent, PaginatorComponent, SearchFiltersComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
  @Input() items: any;

  dataScreen: string = 'items'
  dataItems: any = [];
  showModal = false;
  itemService = inject(ItemService);
  commonService = inject(CommonService);
  errorMessage: string = '';
  allItems: any = [];

  displayedColumns: string[] = ['name', 'price', 'actions'];

  constructor(private dialog: MatDialog){}

  ngOnInit() {
    this.itemService.getItems(localStorage.getItem('id') || "[]").subscribe((items:any) => {
      this.allItems = items;
      this.dataItems = items;
      this.items = items.slice(0,10);
    })
  }

  openTaskDialog(action:string, item: Object) {
    const dialogRef = this.dialog.open(ItemModalComponent);
    dialogRef.componentInstance.item = item;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do something
      }
    });
  }

  updateItems(items: any){
    this.items = items;
  }

  updateSearching(formControlValue: any){
    this.items = this.dataItems;

    for(let k in formControlValue){
      if(formControlValue[k] !== null && formControlValue[k] !== ''){
        if(k === 'name'){
          this.items = this.items.filter((item:any) => item.name.includes(formControlValue[k]));
        }else if(k === 'clientId'){
          this.items = this.items.filter((item:any) => item.clientName === formControlValue[k]);
        }
      }
    }

    this.allItems = this.items;
  }

  deleteItem(id:number){
    const dialogRef = this.dialog.open(DeleteItemModalComponent);
    dialogRef.componentInstance.type = 'el producto'
    dialogRef.componentInstance.id = id;

    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
