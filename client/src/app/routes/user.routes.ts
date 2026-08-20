import { Routes } from "@angular/router";
import { defaultPrivateRouteGuard, userRouteGuard } from "./route.guards";

export const userRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    canActivate: [defaultPrivateRouteGuard],
    loadComponent: () =>
      import("../pages/feature/feature-page.component").then(
        (m) => m.FeaturePageComponent,
      ),
  },
  {
    path: "requests",
    loadComponent: () =>
      import("../pages/feedback/list/feedback-list-page.component").then(
        (m) => m.FeedbackListPageComponent,
      ),
  },
  {
    path: "feedback/new",
    loadComponent: () =>
      import("../pages/feedback/form/feedback-form-page.component").then(
        (m) => m.FeedbackFormPageComponent,
      ),
  },
  {
    path: "feedback/:id/edit",
    loadComponent: () =>
      import("../pages/feedback/form/feedback-form-page.component").then(
        (m) => m.FeedbackFormPageComponent,
      ),
  },
  {
    path: "feedback/:id",
    loadComponent: () =>
      import("../pages/feedback/details/feedback-details-page.component").then(
        (m) => m.FeedbackDetailsPageComponent,
      ),
  },
  {
    path: "my-feedback",
    redirectTo: "requests",
    pathMatch: "full",
  },
  {
    path: "activities",
    loadComponent: () =>
      import("../pages/activities/activities-page.component").then(
        (m) => m.ActivitiesPageComponent,
      ),
  },
  {
    path: "votes",
    redirectTo: "activities",
    pathMatch: "full",
  },
  {
    path: "comments",
    redirectTo: "activities",
    pathMatch: "full",
  },
  {
    path: "profile",
    canActivate: [userRouteGuard],
    loadComponent: () =>
      import("../pages/profile/profile-page.component").then(
        (m) => m.ProfilePageComponent,
      ),
  },
];
