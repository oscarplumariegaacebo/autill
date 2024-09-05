import { Component } from '@angular/core';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent {
  bills: any = [];

  openTaskDialog(n:string, id:number){

  }

  deleteBill(id:number){

  }

}
