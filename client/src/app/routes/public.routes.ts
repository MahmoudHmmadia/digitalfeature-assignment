import { Routes } from "@angular/router";
import { publicRouteGuard } from "./route.guards";

export const publicRoutes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("../pages/login/login.component").then((m) => m.LoginComponent),
    canActivate: [publicRouteGuard],
  },
  {
    path: "register",
    loadComponent: () =>
      import("../pages/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [publicRouteGuard],
  },
  {
    path: "verify-otp",
    loadComponent: () =>
      import("../pages/verify-otp/verify-otp.component").then(
        (m) => m.VerifyOtpComponent,
      ),
    canActivate: [publicRouteGuard],
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("../pages/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent,
      ),
    canActivate: [publicRouteGuard],
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("../pages/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent,
      ),
    canActivate: [publicRouteGuard],
  },
];
