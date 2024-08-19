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
    trigger('openClose', [
      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        }),
      ),
      state(
        'closed',
        style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue',
        }),
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),
    ])
  ]
})
export class LoginComponent {
  registerForm!: FormGroup
  register_option = false;
  err:any | null;

  initializeForm(){
    this.registerForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }
  
  constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router){
    this.initializeForm();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
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
            ///TODO pass email between components
            this.router.navigate(['']);
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
