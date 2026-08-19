import { Routes } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { privateRouteGuard, unknownRouteGuard } from './route.guards';
import { userRoutes } from './user.routes';

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../layouts/private-layout.component').then(
        (m) => m.PrivateLayoutComponent,
      ),
    canActivate: [privateRouteGuard],
    canActivateChild: [privateRouteGuard],
    children: [
      ...userRoutes,
      ...adminRoutes,
      {
        path: '**',
        canActivate: [unknownRouteGuard],
        loadComponent: () =>
          import('../pages/feature/feature-page.component').then(
            (m) => m.FeaturePageComponent,
          ),
      },
    ],
  },
];
