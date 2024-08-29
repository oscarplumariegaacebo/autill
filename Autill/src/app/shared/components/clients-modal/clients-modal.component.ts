import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clients-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './clients-modal.component.html',
  styleUrl: './clients-modal.component.css'
})
export class ClientsModalComponent {
  clientForm!: FormGroup
  id!: number;
  client: Object = {};

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

  constructor(public dialogRef: MatDialogRef<ClientsModalComponent>, private formBuilder: FormBuilder, private apiService: ApiService){
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
    if(this.id == 0){
      this.apiService.addClient(this.clientForm.value).subscribe({
      })
    }else{
      this.apiService.editClient(this.id, this.clientForm.value).subscribe({

      })
    }
  }

}
