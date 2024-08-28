import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { User } from '../models/User';

type UserResponse = {
  result: User;
}

interface UserEdit {
  email: string;
  address: string;
  phoneNumber: number;
  cif: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private readonly api = 'https://localhost:7234/';

  auth(user: any, action: string){
    let auth_action = 'register';
    if(action === 'login'){
      auth_action = 'login';
    }
    return this.http.post(this.api+auth_action, user);
  }

  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.api+'api/Users/'+email);
  }

  editUser(user: any){
    return this.http.put<UserEdit>(this.api+'api/Users', user);
  }
  getBudgets(){
    return this.http.get(this.api+'api/Budgets');
  }
  nextBudgetName(){
    return this.http.get(this.api+'api/Budgets/nextName');
  }
  getClients(){
    return this.http.get(this.api+'api/Clients');
  }
  deleteClient(id: number){
    return this.http.delete(this.api+'api/Clients/'+id);
  }
}
