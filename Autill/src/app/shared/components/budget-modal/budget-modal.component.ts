import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-budget-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './budget-modal.component.html',
  styleUrl: './budget-modal.component.css'
})
export class BudgetModalComponent {
  budgetForm!: FormGroup
  err:any | null;
  loading:boolean = false;

  initializeForm(){
    this.budgetForm = new FormGroup({
      name: new FormControl(),
      price: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<BudgetModalComponent>, private apiService: ApiService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
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
