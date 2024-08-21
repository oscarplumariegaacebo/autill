import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { UserInfoComponent } from './core/components/user-info/user-info.component';
import { HomeComponent } from './core/components/home/home.component';
import { BillsComponent } from './core/components/bills/bills.component';
import { BudgetsComponent } from './core/components/budgets/budgets.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'userInfo', component: UserInfoComponent},
    { path: 'bills', component: BillsComponent},
    { path: 'budgets', component: BudgetsComponent }
];