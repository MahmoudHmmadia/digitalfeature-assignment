import { Routes } from "@angular/router";
import { adminRouteGuard } from "./route.guards";

const featurePage = () =>
  import("../pages/feature/feature-page.component").then(
    (m) => m.FeaturePageComponent,
  );

export const adminRoutes: Routes = [
  {
    path: "admin",
    canActivate: [adminRouteGuard],
    canActivateChild: [adminRouteGuard],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("../pages/admin/overview/overview-page.component").then(
            (m) => m.AdminOverviewPageComponent,
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("../pages/admin/users/users-page.component").then(
            (m) => m.AdminUsersPageComponent,
          ),
      },
      {
        path: "feedbacks",
        loadComponent: () =>
          import("../pages/admin/feedbacks/feedbacks-page.component").then(
            (m) => m.AdminFeedbacksPageComponent,
          ),
      },
      { path: "feadbacks", redirectTo: "feedbacks", pathMatch: "full" },
      {
        path: "review",
        loadComponent: featurePage,
        data: {
          page: {
            title: "Review Queue",
            description:
              "Change request statuses, pin important feedback, and move work through the workflow.",
            items: ["Change status", "Pin requests", "Prioritize feedback"],
          },
        },
      },
      {
        path: "categories",
        loadComponent: featurePage,
        data: {
          page: {
            title: "Categories",
            description:
              "Create, update, and retire feedback categories such as Bug, Feature, Improvement, and Question.",
            items: ["Create category", "Edit category", "Retire category"],
          },
        },
      },
      {
        path: "statuses",
        loadComponent: featurePage,
        data: {
          page: {
            title: "Statuses",
            description:
              "Manage workflow statuses such as New, Under Review, Planned, In Progress, Done, and Declined.",
            items: ["Create status", "Order workflow", "Retire status"],
          },
        },
      },
      {
        path: "comments",
        loadComponent: featurePage,
        data: {
          page: {
            title: "Moderation",
            description:
              "Moderate or remove comments and content that need admin attention.",
            items: [
              "Review comments",
              "Delete inappropriate content",
              "Approval workflow",
            ],
          },
        },
      },
      {
        path: "settings",
        loadComponent: () =>
          import("../pages/admin/settings/settings-page.component").then(
            (m) => m.AdminSettingsPageComponent,
          ),
      },
    ],
  },
];
