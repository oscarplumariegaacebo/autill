import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/User';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  userInfo!: FormGroup

  initializeForm(){
    this.userInfo = new FormGroup({
      email: new FormControl(),
      address: new FormControl(),
      phoneNumber: new FormControl(),
      cif: new FormControl()
    })
  }

  constructor (private service: ApiService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }
  
  ngOnInit() {
    this.service.getUserByEmail('oscarplumariegacebo@gmail.com').subscribe((data: any) => {
        this.userInfo = this.formBuilder.group({
          email: [data.email ? data.email : '', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
          address: [data.address? data.address : '', [Validators.required]],
          cif: [data.cif? data.cif : '', [Validators.required]],
          phoneNumber: [data.phoneNumber? data.phoneNumber : '', [Validators.required]]
        });
    })
  }

}
