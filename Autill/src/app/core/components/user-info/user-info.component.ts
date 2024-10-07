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
      userName: new FormControl(),
      fullName: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      address: new FormControl(),
      phoneNumber: new FormControl('',[Validators.pattern(/^[+]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?)(?:[ -]?(?:\(\d+(?:\.\d+)?\)|\d+(?:\.\d+)?))*(?:[ ]?(?:x|ext)\.?[ ]?\d{1,5})?$/), Validators.required, Validators.maxLength(9)]),
      logo: new FormControl(),
      nif: new FormControl('',[Validators.pattern( /^(\d{8})([A-Z])$/), Validators.required, Validators.maxLength(9)]),
      id: new FormControl(),
      postalCode: new FormControl(),
      region: new FormControl(),
      country: new FormControl(),
      normalizedUserName: new FormControl(),
      normalizedEmail: new FormControl(),
      emailConfirmed: new FormControl(),
      passwordHash: new FormControl(),
      securityStamp: new FormControl(),
      concurrencyStamp: new FormControl(),
      phoneNumberConfirmed: new FormControl(),
      twoFactorEnabled: new FormControl(),
      lockoutEnd: new FormControl(),
      lockoutEnabled: new FormControl(),
      accessFailedCount: new FormControl()
    })
  }

  constructor (private service: ApiService, private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    this.emailLogin = localStorage.getItem('email') || "[]";
    this.service.getUserByEmail(this.emailLogin).subscribe((data: any) => {
      this.userInfo.setValue(data);
      this.logoPath = data.logo;
    })
  }

  updateUser(){
    if(this.userInfo.valid){
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

}
