import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }

  private readonly api = 'https://localhost:7234/';

  getBills(){
    return this.http.get(this.api+'api/Bills')
  }
  deleteBill(id: number){
    return this.http.delete(this.api+'api/Bills/'+id);
  }
  cloneRegister(id:number){
    return this.http.post(this.api+'api/Bills/clone',id);
  }
}
