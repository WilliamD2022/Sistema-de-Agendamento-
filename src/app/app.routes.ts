import { Routes } from '@angular/router';
import { CustomersPageComponent } from './pages/customers/customers-page.component';
import { LoginPageComponent } from './login/login-page.component';
import { authGuard } from './security/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'customers', component: CustomersPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'customers' }
];
