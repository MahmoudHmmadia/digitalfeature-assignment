import { Routes } from '@angular/router';
import { adminRouteGuard } from './route.guards';

const featurePage = () =>
  import('../pages/feature/feature-page.component').then(
    (m) => m.FeaturePageComponent,
  );

export const adminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [adminRouteGuard],
    canActivateChild: [adminRouteGuard],
    children: [
      {
        path: '',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'Admin Overview',
            description:
              'Review incoming feedback, monitor moderation needs, and manage workflow health.',
            items: ['Review recent requests', 'Track pinned feedback', 'Watch moderation queue'],
          },
        },
      },
      {
        path: 'review',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'Review Queue',
            description:
              'Change request statuses, pin important feedback, and move work through the workflow.',
            items: ['Change status', 'Pin requests', 'Prioritize feedback'],
          },
        },
      },
      {
        path: 'categories',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'Categories',
            description:
              'Create, update, and retire feedback categories such as Bug, Feature, Improvement, and Question.',
            items: ['Create category', 'Edit category', 'Retire category'],
          },
        },
      },
      {
        path: 'statuses',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'Statuses',
            description:
              'Manage workflow statuses such as New, Under Review, Planned, In Progress, Done, and Declined.',
            items: ['Create status', 'Order workflow', 'Retire status'],
          },
        },
      },
      {
        path: 'comments',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'Moderation',
            description:
              'Moderate or remove comments and content that need admin attention.',
            items: ['Review comments', 'Delete inappropriate content', 'Approval workflow'],
          },
        },
      },
      {
        path: 'settings',
        loadComponent: featurePage,
        data: {
          page: {
            title: 'App Settings',
            description:
              'Configure registration policy, comment approval, rate limits, and feature flags.',
            items: ['Registration policy', 'Comment approval', 'Feature flags'],
          },
        },
      },
    ],
  },
];
