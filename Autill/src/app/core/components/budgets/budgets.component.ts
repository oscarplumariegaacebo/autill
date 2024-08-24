import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  budgets:any = [];

  constructor(private service: ApiService){}

  ngOnInit() {
    this.service.getBudgets().subscribe((data:any) => {
      this.budgets = data;
    })
  }
}
