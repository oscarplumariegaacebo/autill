import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { MainComponent } from './shared/components/main/main.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent}
];
