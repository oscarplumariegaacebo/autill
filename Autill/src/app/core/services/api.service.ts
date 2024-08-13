import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
