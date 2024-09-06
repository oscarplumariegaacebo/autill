import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent {
  bills: any = [];
  apiService = inject(ApiService);

  openTaskDialog(n:string, id:number){

  }

  deleteBill(id:number){

  }

}
