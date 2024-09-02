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
  items = [{id: 0, name: '', units: 0, price: 0, totalConcept: 0}];
  data = [];

  constructor(public dialogRef: MatDialogRef<BudgetDetailsComponent>){}

  ngOnInit() {
    if(this.data.length > 0){
      this.items = this.data;
    }
  }

  onClose(): void {
    if(this.items[this.items.length - 1].totalConcept == 0){
      this.items.pop();
      this.dialogRef.close({data: this.items});
    }
    if(this.items.length == 0){
      this.dialogRef.close();
    }
  }

  addItem(id:number){
    let nameInput = document.getElementById('name'+id) as HTMLInputElement;
    let unitsInput = document.getElementById('units'+id) as HTMLInputElement;
    let priceInput = document.getElementById('priceTD'+id) as HTMLInputElement; 

    this.items[id].name = nameInput.value;
    this.items[id].units = parseFloat(unitsInput.value);
    this.items[id].price = parseFloat(priceInput.value);
    this.items[id].totalConcept = parseFloat(unitsInput.value) * parseFloat(priceInput.value);

    this.items.push({id: id+1, name: '', units: 0, price: 0, totalConcept: 0});
  }
}
