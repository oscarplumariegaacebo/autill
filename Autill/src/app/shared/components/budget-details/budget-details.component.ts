import { Component, inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { Item } from '../../../core/models/Item';
import { ItemService } from '../../../core/services/item.service';


@Component({
  selector: 'app-budget-details',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule,MatInputModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe],
  templateUrl: './budget-details.component.html',
  styleUrl: './budget-details.component.css'
})
export class BudgetDetailsComponent {
  items = [{id: 0, name: '', units: 0, price: 0, totalConcept: 0}];
  data = [];
  dbItems:any = [];
  apiService = inject(ApiService);
  itemService = inject(ItemService);
  Item = new FormControl<ItemInit | string>('');
  filteredItems!: Observable<Item[]>;
  lastOptionIdSelected:number = 0;
  lasItemAdded: any = {};
  detailsForm!: FormGroup;
  nameDefault: string = '';
  itemsData = [];

  initializeForm(){
    this.detailsForm = new FormGroup({
      Item0: new FormControl(),
      PriceTD0: new FormControl(),
      Units0: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetDetailsComponent>){
    this.initializeForm();
  }

  ngOnInit() {
    if(this.data.length > 0){
      this.items = this.data;
      this.itemsData = this.data;
      console.log(this.itemsData);
    }

    this.itemService.getItems().subscribe((data:any) => {
      this.dbItems = data;

      this.filteredItems = this.detailsForm.controls['Item0'].valueChanges.pipe(
        startWith(''),
        map(value => {
          const item = value;
          return item ? this._filter(item as string) : this.dbItems || '';
        }),
      );
    })

    for (let i = 0; i < this.items.length; i++) {
      if(i>0){
        this.detailsForm.addControl(`Item${i}`, new FormControl());
      }
    }
  }

  ngAfterViewInit() {
    for (let i = 0; i < this.items.length; i++) {
      this.detailsForm.get(`Item${i}`)!.setValue(this.items[i].name);
      this.detailsForm.get(`Units${i}`)!.setValue(this.items[i].units);
      this.detailsForm.get(`PriceTD${i}`)!.setValue(this.items[i].price);
    }
  }

  onClose(): void {
    if(this.items[this.items.length - 1].totalConcept == 0){
      this.items.pop();
    }
    this.dialogRef.close({data: this.items});
  }

  addItem(id:number,from:string){
    if(id+1 === this.items.length){
      this.detailsForm.addControl(`Item${id+1}`, new FormControl());
      this.detailsForm.addControl(`PriceTD${id+1}`, new FormControl());
      this.detailsForm.addControl(`Units${id+1}`, new FormControl());

      this.items.push({id: id+1, name: '', units: 0, price: 0, totalConcept: 0});
    }else{
      let unitsInput = document.getElementById('units'+id) as HTMLInputElement;
      let name = this.detailsForm.controls['Item'+id].value;
      let price = document.getElementById('priceTD'+id) as HTMLInputElement;
  
      let units = parseFloat(unitsInput.value);
  
      this.items[id].units = units;
      if(from === 'newItem'){
        this.detailsForm.addControl(`Item${id+1}`, new FormControl());
        this.detailsForm.addControl(`PriceTD${id+1}`, new FormControl());
        this.detailsForm.addControl(`Units${id+1}`, new FormControl());

        this.items[id].name = this.lasItemAdded.name;
        this.items[id].price = parseFloat(this.lasItemAdded.price);
        this.items[id].totalConcept = parseFloat(unitsInput.value) * parseFloat(this.lasItemAdded.price);

        this.items.push({id: id+1, name: '', units: 0, price: 0, totalConcept: 0});
      }else{
        console.log(this.items[id]);
        this.items[id].name = name;
        this.items[id].price = parseFloat(price.value);
        this.items[id].totalConcept = units * this.items[id].price;

        this.detailsForm.get(`Item${id+1}`)!.setValue(this.items[id].name);
        this.detailsForm.get(`Units${id+1}`)!.setValue(this.items[id].units);
        this.detailsForm.get(`PriceTD${id+1}`)!.setValue(this.items[id].price);
      }

      this.filteredItems = this.detailsForm.controls[`Item${id+1}`].valueChanges.pipe(
        startWith(''),
        map(value => {
          const item = value;
          return item ? this._filter(item as string) : this.dbItems || '';
        }),
      );
    }
  }

  changeSelection(id: number, name: string, event: any){
    if (event.isUserInput) {
      this.lastOptionIdSelected = id;
      this._filter(name);
    }
  }

  private _filter(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.Item.toLowerCase();

    let itemSelected = this.dbItems.find((item:any) => item.name === value)!;

    if(itemSelected !== undefined) {
      let priceElement = document.getElementById(`priceTD${this.lastOptionIdSelected}`)! as HTMLInputElement;
      priceElement.value = itemSelected.price;
    }

    this.lasItemAdded = itemSelected;

    return this.dbItems.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }

  addItems(){
    this.addItem(this.items.length-1, 'newItem');
    console.log(this.detailsForm);
    //this.items.pop();

    this.onClose();
  }

  unitsChange(idItem: number, event: any){
    let refreshUnits = (event.target as HTMLInputElement).value

    this.items[idItem].units = parseFloat(refreshUnits);
    this.items[idItem].totalConcept = this.items[idItem].units * this.items[idItem].price;
  }
}

export class ItemInit {
  constructor(public id: number, public name: string, public price: number) {

  }
}