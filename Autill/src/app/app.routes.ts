import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { UserInfoComponent } from './core/components/user-info/user-info.component';
import { HomeComponent } from './core/components/home/home.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent},
    { path: 'userInfo', component: UserInfoComponent}
];
