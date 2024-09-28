import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BudgetDetailsComponent } from '../budget-details/budget-details.component';
import { Router } from '@angular/router';
import moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};


@Component({
  selector: 'app-budget-modal',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
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
  date = new FormControl(new Date());



  initializeForm() {
    this.budgetForm = new FormGroup({
      id: new FormControl(),
      idBusiness: new FormControl(),
      name: new FormControl(),
      price: new FormControl(),
      descriptionItems: new FormControl(),
      clientId: new FormControl(),
      clientName: new FormControl(),
      date: new FormControl(),
      closeIt: new FormControl(false)
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
          console.log(this.budgetForm.controls);
          this.budgetForm.get('date')!.setValue(budget.date);
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


        let date = this.budgetForm.controls['date'].value;
        let formatDate = moment(date).utc().format("DD/MM/YYYY");
        let day = parseInt(formatDate.slice(0,2)) + 1;
        formatDate = day.toString() + formatDate.slice(2,formatDate.length);

        this.budgetForm.controls['date'].setValue(formatDate);

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
