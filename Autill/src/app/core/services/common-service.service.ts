import { inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { ApiService } from './api.service';
import autoTable from 'jspdf-autotable'
import { BudgetService } from './budget.service';
import { ClientService } from './client.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiService = inject(ApiService);
  budgetService = inject(BudgetService);
  clientService = inject(ClientService);
  userService = inject(UserService);

  constructor() { }

  generatePDF(type:string, id:number){
    let title = '';
    if(type === 'bill') {
      title = 'Factura'
    }else {
      title = 'Presupuesto'
    }

    this.budgetService.getBudgetById(id).subscribe((budget:any) => {
      this.userService.getUserById(budget.idBusiness).subscribe((user: any) => {
        this.clientService.getClientById(budget.clientId).subscribe({
          next: (client:any) =>{
            const doc = new jsPDF();
  
            doc.setFontSize(28);
            doc.setFont('courier');
            //title
            doc.text(title + ' - ' + budget.name.split('-').pop(), 100, 20);

            if(user.logo != null){
              doc.addImage(user.logo, 'JPEG', 0, 0, 30, 30);
            }
    
            doc.setFontSize(14);
            //user data
            doc.text(user.fullName, 10, 40);
            doc.text(user.email, 10, 50);
            doc.text(user.nif, 10, 60);
            doc.text(user.address, 10, 70);
            doc.text(user.region + ' ' + user.country, 10, 80);
            doc.text(user.phoneNumber, 10, 90);
    
            //client data
            doc.text(client.name, 120, 40);
            doc.text(client.email, 120, 50);
            doc.text(client.nif, 120, 60);
            doc.text(client.address, 120, 70);
            doc.text(client.region + ' ' + client.country, 120, 80);
            doc.text(client.phoneNumber, 120, 90);

            let bodyFormatItems = [];

            const items = JSON.parse(budget.descriptionItems);
            for (let i = 0; i < items.length; i++) {
              bodyFormatItems.push([items[i].name, items[i].units, items[i].price, items[i].totalConcept]);
            }

            autoTable(doc, {
              margin: { top: 100 },
              head: [["Concepto","Unidades","Precio/Unidad","Total"]],
              body: bodyFormatItems,
            })

            doc.text("Subtotal   " + budget.price, 150, 260);
            doc.text("IVA 21%   " + Number((budget.price*0.21).toFixed(2)) + "€", 150, 270);

            doc.setFont('courier','bold');
            doc.text("TOTAL   " + Number((budget.price*1.21).toFixed(2)) + "€", 150, 290);
    
            doc.save(title + '-' + budget.name.split('-').pop()+".pdf");
          } 
        })
      });
    })
  }
}
