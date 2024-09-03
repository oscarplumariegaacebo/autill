import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BudgetDetailsComponent } from '../budget-details/budget-details.component';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-budget-modal',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './budget-modal.component.html',
  styleUrl: './budget-modal.component.css'
})
export class BudgetModalComponent {
  budgetForm!: FormGroup
  err:any | null;
  loading:boolean = false;
  clients:any = [];
  apiService = inject(ApiService);
  id!:number;
  nextName!:string;
  modalItemsArray = [];

  initializeForm(){
    this.budgetForm = new FormGroup({
      id: new FormControl(),
      idBusiness: new FormControl(),
      name: new FormControl(),
      price: new FormControl(),
      descriptionItems: new FormControl(),
      clientId: new FormControl(),
      date: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>, private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.initializeForm();
  }

  ngOnInit() {
    this.apiService.getClients().subscribe((clients:any) => {
      this.clients = clients;
    })
    this.apiService.nextBudgetName().subscribe((name:any) => {
      if(this.id>0){
        this.apiService.getBudgetById(this.id).subscribe((budget:any) => {
          this.budgetForm.setValue(budget);
          this.modalItemsArray = JSON.parse(budget.descriptionItems);
        })
      }else{
        this.budgetForm.controls['name'].setValue('Prespuesto'+name.name);
      }
    })
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(BudgetDetailsComponent);
    if(this.modalItemsArray.length > 0){
      dialogRef.componentInstance.data = this.modalItemsArray;
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sumTotalPrice = 0;

        for (let i = 0; i <  result.data.length; i++) {
          sumTotalPrice = sumTotalPrice +  result.data[i].totalConcept;
        }

        this.budgetForm.controls['price'].setValue(sumTotalPrice);
        this.modalItemsArray = result.data;

        this.budgetForm.controls['descriptionItems'].setValue(JSON.stringify(result.data));
      }
    });
  }

  actionBudget(){
    this.loading = true;
    if(this.id == 0){
      this.budgetForm.removeControl('id');
      this.apiService.getUserByEmail(localStorage.getItem('email') || "[]").subscribe((user:any) => {
        this.budgetForm.controls['idBusiness'].setValue(user.id);
          this.apiService.addBudget(this.budgetForm.value).subscribe({
            next: () => {
              this.budgetForm.addControl('id', new FormControl());
            },
            complete: () => {
              window.location.reload();
            }
          })
      })
    }else{
      this.apiService.editClient(this.id, this.budgetForm.value).subscribe({
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
    }
  }

  generatePDF(){
    const doc = new jsPDF();
  
    console.log(this.budgetForm.value);

    /*doc.text("Hello world", 10, 10);
    doc.save("a4.pdf");*/
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
