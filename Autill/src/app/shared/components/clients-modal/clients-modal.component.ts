import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      postalCode: new FormControl(),
      email: new FormControl(),
      country: new FormControl(),
      cif: new FormControl(),
      phoneNumber: new FormControl()
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
      this.apiService.addClient(this.clientForm.value).subscribe({
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
