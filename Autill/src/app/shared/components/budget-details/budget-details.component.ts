import { Component, inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import { map, Observable, startWith } from 'rxjs';


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
  myControl = new FormControl('');
  filteredOptions!: Observable<any[]>;
  lastOptionIdSelected:number = 0;
  lasItemAdded: any = {};
  detailsForm!: FormGroup;

  initializeForm(){
    this.detailsForm = new FormGroup({
      detailInput0: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetDetailsComponent>){
    this.initializeForm();
  }

  ngOnInit() {
    document.getElementById("detailInput0")?.setAttribute("[formControl]","detailInput0");
    if(this.data.length > 0){
      this.items = this.data;
    }

    this.filteredOptions = this.detailsForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  onClose(): void {
    if(this.items[this.items.length - 1].totalConcept == 0){
      this.items.pop();
    }
    this.dialogRef.close({data: this.items});
  }

  addItem(id:number){
    let unitsInput = document.getElementById('units'+id) as HTMLInputElement;

    this.items[id].name = this.lasItemAdded.name;
    this.items[id].units = parseFloat(unitsInput.value);
    this.items[id].price = parseFloat(this.lasItemAdded.priceU);
    this.items[id].totalConcept = parseFloat(unitsInput.value) * parseFloat(this.lasItemAdded.priceU);

    this.items.push({id: id+1, name: '', units: 0, price: 0, totalConcept: 0});
  }

  changeSelection(id: number, name: string){
    this.lastOptionIdSelected = id;
    this._filter(name);
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();

    let itemSelected = this.dbItems.find((item:any) => item.name === value)!;

    if(itemSelected !== undefined) {
      let priceElement = document.getElementById(`priceTD${this.lastOptionIdSelected}`)! as HTMLInputElement;
      priceElement.value = itemSelected.priceU;
    }

    this.lasItemAdded = itemSelected;

    return this.dbItems.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }
}
