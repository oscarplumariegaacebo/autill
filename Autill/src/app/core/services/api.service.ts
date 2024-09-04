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

interface Client{
  id: number,
  name: string,
  address: string,
  region: string,
  city: string,
  postalCode: number,
  email: string,
  country: string,
  cif: string,
  phoneNumber: number
}

interface Budget{
  id: number,
  name: string,
  clientId: number,
  price: number,
  descriptionItems: string,
  date: string
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

  getUserByEmail(email: string) {
    return this.http.get(this.api+'api/Users/byEmail/'+email);
  }
  getUserById(id: string) {
    return this.http.get(this.api+'api/Users/'+id);
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
  getClientById(id:number){
    return this.http.get(this.api+'api/Clients/'+id);
  }
  deleteClient(id: number){
    return this.http.delete(this.api+'api/Clients/'+id);
  }
  addClient(client:Client){
    return this.http.post<Client>(this.api+'api/Clients', client)
  }
  editClient(id:number, client:any){
    return this.http.put(this.api+'api/Clients/'+id, client)
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
