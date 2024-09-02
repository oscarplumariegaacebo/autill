import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-budget-details',
  standalone: true,
  imports: [],
  templateUrl: './budget-details.component.html',
  styleUrl: './budget-details.component.css'
})
export class BudgetDetailsComponent {
  items = [{id: 0, name: '', units: '0', price: '0'}];

  constructor(public dialogRef: MatDialogRef<BudgetDetailsComponent>){}

  onClose(): void {
    this.dialogRef.close();
  }

  addItem(id:number){
    let name = document.getElementById('name'+id) as HTMLInputElement;
    let units = document.getElementById('units'+id) as HTMLInputElement;
    let price = document.getElementById('priceTD'+id) as HTMLInputElement; 

    this.items[id].name = name.value;
    this.items[id].units = units.value;
    this.items[id].price = price.value;

    this.items.push({id: id+1, name: '', units: '0', price: '0'});
  }
}
