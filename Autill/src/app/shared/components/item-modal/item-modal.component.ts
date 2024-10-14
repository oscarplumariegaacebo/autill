import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SpinnerLoadingComponent } from '../spinner-loading/spinner-loading.component';
import { ClientService } from '../../../core/services/client.service';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [SpinnerLoadingComponent, ReactiveFormsModule],
  templateUrl: './item-modal.component.html',
  styleUrl: './item-modal.component.css'
})
export class ItemModalComponent {
  itemForm!: FormGroup
  id!: number;
  client: Object = {};
  loading:boolean = false;
  apiService = inject(ApiService);
  clientService = inject(ClientService);
  itemService = inject(ItemService);

  initializeForm(){
    this.itemForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      priceU: new FormControl()
    })
  }

  constructor(public dialogRef: MatDialogRef<ItemModalComponent>, private formBuilder: FormBuilder){
    this.initializeForm();
  }

  ngOnInit(){

  }

  onClose(): void {
    this.dialogRef.close();
  }

  actionClient(){
    this.loading = true;
    if(this.id == 0){
      this.itemForm.removeControl('id');
      this.itemService.addItem(this.itemForm.value).subscribe({
        next: () => {
          this.itemForm.addControl('id', new FormControl());
        },
        complete: () => {
          window.location.reload();
        }
      })
    }else{
      this.clientService.editClient(this.id, this.itemForm.value).subscribe({
        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      })
    }
  }
}
