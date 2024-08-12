import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private readonly api = 'https://localhost:7234/';

  register(user: any){
    return this.http.post(this.api+'register', user);
  }
}
