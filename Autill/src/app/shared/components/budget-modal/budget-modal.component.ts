import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BudgetDetailsComponent } from '../budget-details/budget-details.component';
import { Router } from '@angular/router';

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
  err: any | null;
  loading: boolean = false;
  clients: any = [];
  apiService = inject(ApiService);
  id!: number;
  nextName!: string;
  modalItemsArray = [];
  action:string = '';
  dbItems = [];

  initializeForm() {
    this.budgetForm = new FormGroup({
      id: new FormControl(),
      idBusiness: new FormControl(),
      name: new FormControl(),
      price: new FormControl(),
      descriptionItems: new FormControl(),
      clientId: new FormControl(),
      clientName: new FormControl(),
      date: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) {
    this.initializeForm();
  }

  ngOnInit() {
    this.apiService.getClients().subscribe((clients: any) => {
      this.clients = clients;
    })
    this.apiService.getItems().subscribe((data:any) => {
      this.dbItems = data;
    })
    this.apiService.nextBudgetName().subscribe((name: any) => {
      if (this.id > 0) {
        this.apiService.getBudgetById(this.id).subscribe((budget: any) => {
          this.budgetForm.setValue(budget);
          this.modalItemsArray = JSON.parse(budget.descriptionItems);
        })
      } else {
        this.budgetForm.controls['name'].setValue('Prespuesto' + name.name);
      }
    })
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(BudgetDetailsComponent);
    if (this.modalItemsArray.length > 0) {
      dialogRef.componentInstance.data = this.modalItemsArray;
    }
    dialogRef.componentInstance.dbItems = this.dbItems;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let sumTotalPrice = 0;

        for (let i = 0; i < result.data.length; i++) {
          sumTotalPrice = sumTotalPrice + result.data[i].totalConcept;
        }

        this.budgetForm.controls['price'].setValue(sumTotalPrice);
        this.modalItemsArray = result.data;

        this.budgetForm.controls['descriptionItems'].setValue(JSON.stringify(result.data));
      }
    });
  }

  actionBudget() {
    this.loading = true;
    if (this.id == 0) {
      for (let i = 0; i < this.clients.length; i++) {
        if(this.clients[i].id == this.budgetForm.controls['clientId'].value){
          this.budgetForm.controls['clientName'].setValue(this.clients[i].name);
        }
      }

      this.budgetForm.removeControl('id');
      this.apiService.getUserByEmail(localStorage.getItem('email') || "[]").subscribe((user: any) => {
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
    } else {
      this.apiService.editBudget(this.id, this.budgetForm.value).subscribe({
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  generateBill(){
    this.loading = true;
    this.apiService.cloneRegister(this.id).subscribe({
        complete: () => {
          this.loading = false;
          this.onClose();
          this.router.navigate(['/bills']);
        }
    })
  }
}
