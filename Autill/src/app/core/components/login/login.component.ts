import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: 100, opacity: 1 }),
            animate('1s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class LoginComponent {
  registerForm: FormGroup | any;
  email = new FormControl("");
  password = new FormControl("");
  register_option = false;
  err:any | null;
  
  constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
      password: ['', [Validators.required]]
    });
  }

  authUser(action: string){
    if (this.registerForm.valid) {
      if(action === 'register') {
        this.api.auth(this.registerForm.value, action).subscribe({
          next: () => {},
          error: (err) => {
            let errObj = err.error.errors;
            this.err = Object.values(errObj);
          }
        });
      }else{
        this.api.auth(this.registerForm.value, action).subscribe({
          next: () => {
            this.router.navigate(['main']);
          }
        });
      }
    } else {
      alert('Form invalid. Please fill out the form correctly.');
    }
  }

  changeForm(){
    this.register_option = !this.register_option;
  }
}
