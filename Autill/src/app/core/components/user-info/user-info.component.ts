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
  logoPath!: string

  initializeForm(){
    this.userInfo = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      address: new FormControl(),
      phoneNumber: new FormControl(),
      cif: new FormControl(),
      id: new FormControl()
    })
  }

  constructor (private service: ApiService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    this.service.getUserByEmail('oscarplumariegacebo@gmail.com').subscribe((data: any) => {
      this.logoPath = data.logo;
      console.log(data.logo);
        this.userInfo = this.formBuilder.group({
          fullName: [data.fullName ? data.fullName : '', [Validators.required]],
          email: [data.email ? data.email : ''],
          address: [data.address? data.address : '', [Validators.required]],
          cif: [data.cif? data.cif : '', [Validators.required]],
          phoneNumber: [data.phoneNumber? data.phoneNumber : '', [Validators.required]],
          id: [data.id? data.id : '']
        });
    })
  }

  updateUser(){
    this.service.editUser(this.userInfo.value).subscribe({
      next: () => {
        alert("sucess");
      }
    })
  }

}
