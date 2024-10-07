import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SpinnerLoadingComponent } from '../spinner-loading/spinner-loading.component';

@Component({
  selector: 'app-clients-modal',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerLoadingComponent],
  templateUrl: './clients-modal.component.html',
  styleUrl: './clients-modal.component.css'
})
export class ClientsModalComponent {
  clientForm!: FormGroup
  id!: number;
  client: Object = {};
  loading:boolean = false;
  apiService = inject(ApiService);

  initializeForm(){
    this.clientForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      address: new FormControl(),
      region: new FormControl(),
      city: new FormControl(),
      postalCode: new FormControl('',[Validators.pattern(/^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/), Validators.required, Validators.maxLength(5)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      country: new FormControl(),
      nif: new FormControl('',[Validators.pattern(/^[A-Va-w][0-9]{8}[A-Z]$|^[0-9]{7}[0-9A-Ja]$/), Validators.required, Validators.maxLength(9)]),
      phoneNumber: new FormControl('',[Validators.pattern(/^[+]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?)(?:[ -]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?))*(?:[ ]?(?:x|ext)\.?[ ]?\d{1,5})?$/), Validators.required, Validators.maxLength(9)])
    })
  }

  constructor(public dialogRef: MatDialogRef<ClientsModalComponent>, private formBuilder: FormBuilder){
    this.initializeForm();
  }

  ngOnInit() {
    if(this.id > 0){
      this.apiService.getClientById(this.id).subscribe((client:any) =>{
        this.clientForm.setValue(client);
      })
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  actionClient(){
    this.loading = true;
    if(this.id == 0){
      this.clientForm.removeControl('id');
      this.apiService.addClient(this.clientForm.value).subscribe({
        next: () => {
          this.clientForm.addControl('id', new FormControl());
        },
        complete: () => {
          window.location.reload();
        }
      })
    }else{
      this.apiService.editClient(this.id, this.clientForm.value).subscribe({
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
    }
  }

}
