import { Routes } from '@angular/router';
import { privateRoutes } from './private.routes';
import { publicRoutes } from './public.routes';

export const routes: Routes = [
  ...publicRoutes,
  ...privateRoutes,
];
