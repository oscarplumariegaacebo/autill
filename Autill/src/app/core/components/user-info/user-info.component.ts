import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/User';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerLoadingComponent } from '../../../shared/components/spinner-loading/spinner-loading.component';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerLoadingComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  userInfo!: FormGroup
  logoPath!: string
  loading: boolean = false;
  emailLogin: string = '';

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
    this.emailLogin = localStorage.getItem('email') || "[]";
    this.service.getUserByEmail(this.emailLogin).subscribe((data: any) => {
      this.logoPath = data.logo;
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
        this.loading = true;
      },
      complete: () => {
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      }
    })
  }

}
