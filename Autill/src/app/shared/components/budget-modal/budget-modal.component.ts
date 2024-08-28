import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

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

  initializeForm(){
    this.budgetForm = new FormGroup({
      name: new FormControl(),
      price: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>, private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    this.apiService.getClients().subscribe((clients:any) => {
      this.clients = clients;
    })
    this.apiService.nextBudgetName().subscribe((name:any) => {
      this.budgetForm = this.formBuilder.group({
        name: [name.name, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
        password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
      });
    })

  }

  onClose(): void {
    this.dialogRef.close();
  }
}
