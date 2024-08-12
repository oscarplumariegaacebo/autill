import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerForm: FormGroup | any;
  email = new FormControl("");
  password = new FormControl("");
  
  constructor(private api: ApiService, private formBuilder: FormBuilder){}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
      password: ['', [Validators.required]]
    });
  }

  addUser(){
    if (this.registerForm.valid) {
      this.api.register(this.registerForm.value).subscribe();
    } else {
      alert('Form invalid. Please fill out the form correctly.');
    }
  }
}
