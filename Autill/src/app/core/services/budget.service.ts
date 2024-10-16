import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, BudgetResults } from '../models/Budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }

  private readonly api = 'https://localhost:7234/';

  getBudgets(id:string): Observable<BudgetResults>{
    return this.http.get<BudgetResults>(this.api+'api/Budgets/list/'+id);
  }
  nextBudgetName(){
    return this.http.get(this.api+'api/Budgets/nextName');
  }
  editBudget(id:number, budget:Budget){
    return this.http.put(this.api+'api/Budgets/'+id, budget)
  }
  addBudget(budget:Budget){
    return this.http.post<Budget>(this.api+'api/Budgets', budget)
  }
  deleteBudget(id: number){
    return this.http.delete(this.api+'api/Budgets/'+id);
  }
  getBudgetById(id: number){
    return this.http.get(this.api+'api/Budgets/'+id);
  }
}
