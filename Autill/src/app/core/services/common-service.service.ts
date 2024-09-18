import { inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiService = inject(ApiService);

  constructor() { }

  generatePDF(id:number){
    this.apiService.getBudgetById(id).subscribe((budget:any) => {
      this.apiService.getUserById(budget.idBusiness).subscribe((user: any) => {
        this.apiService.getClientById(budget.clientId).subscribe({
          next: (client:any) =>{
            const doc = new jsPDF();
  
            doc.setFontSize(28);
            //title
            doc.text(budget.name, 10, 10);
    
            doc.setFontSize(14);
            //user data
            doc.text(user.fullName, 10, 20);
            doc.text(user.email, 10, 30);
            doc.text(user.cif, 10, 40);
            doc.text(user.address, 10, 50);
            doc.text(user.phoneNumber, 10, 60);
    
            //client data
            doc.text(client.name, 120, 20);
            doc.text(client.email, 120, 30);
            doc.text(client.cif, 120, 40);
            doc.text(client.address, 120, 50);
            doc.text(client.phoneNumber, 120, 60);
    
            doc.save("a4.pdf");
          } 
        })
      });
    })
  }
}
