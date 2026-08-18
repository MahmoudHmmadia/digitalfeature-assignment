import { Routes } from '@angular/router';
import { isAuthenticated } from '../context/global';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [() => !isAuthenticated()],
  },
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home.component').then(
        (m) => m.HomeComponent,
      ),
    canActivate: [() => isAuthenticated()],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
