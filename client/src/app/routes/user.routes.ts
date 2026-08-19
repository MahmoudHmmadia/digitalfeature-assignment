import { Routes } from '@angular/router';

const featurePage = () =>
  import('../pages/feature/feature-page.component').then(
    (m) => m.FeaturePageComponent,
  );

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Requests',
        description:
          'Browse, search, filter, vote on, and discuss product feedback requests.',
        items: ['Search requests', 'Filter by status and category', 'Open discussions'],
      },
    },
  },
  {
    path: 'feedback/new',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Create Feedback',
        description:
          'Submit a new product request with a clear title, category, and supporting details.',
        items: ['Describe the request', 'Choose category', 'Submit for review'],
      },
    },
  },
  {
    path: 'my-feedback',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'My Feedback',
        description:
          'Manage feedback requests you created and update or delete your own items.',
        items: ['Drafts and submissions', 'Edit own requests', 'Delete own requests'],
      },
    },
  },
  {
    path: 'votes',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Votes',
        description:
          'Track requests you upvoted and withdraw votes when priorities change.',
        items: ['Upvoted requests', 'Vote history', 'Remove vote'],
      },
    },
  },
  {
    path: 'comments',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Comments',
        description:
          'Review your discussion activity and manage comments you own.',
        items: ['Recent comments', 'Edit comments', 'Delete comments'],
      },
    },
  },
  {
    path: 'profile',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Profile',
        description:
          'Manage your display name, avatar, language, preferences, and account settings.',
        items: ['Profile details', 'Notification preferences', 'Account deletion'],
      },
    },
  },
  {
    path: 'settings',
    loadComponent: featurePage,
    data: {
      page: {
        title: 'Settings',
        description:
          'Control personal defaults for sorting, filters, theme, language, and notifications.',
        items: ['Default sorting', 'Default filters', 'Theme and language'],
      },
    },
  },
];
