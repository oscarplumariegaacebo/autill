import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { MainComponent } from './shared/components/main/main.component';
import { UserInfoComponent } from './core/components/user-info/user-info.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent},
    {path: 'userInfo', component: UserInfoComponent}
];
