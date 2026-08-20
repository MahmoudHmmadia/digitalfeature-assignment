import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { accountInfo, isAuthenticated } from "../context/global";

export const publicRouteGuard: CanActivateFn = () => {
  const router = inject(Router);

  return isAuthenticated() ? router.createUrlTree(["/"]) : true;
};

export const privateRouteGuard: CanActivateFn | CanActivateChildFn = () => {
  const router = inject(Router);

  return isAuthenticated() ? true : router.createUrlTree(["/login"]);
};

export const defaultPrivateRouteGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!isAuthenticated()) return router.createUrlTree(["/login"]);

  return router.createUrlTree([
    accountInfo()?.role === "ADMIN" ? "/admin" : "/requests",
  ]);
};

export const adminRouteGuard: CanActivateFn | CanActivateChildFn = () => {
  const router = inject(Router);

  if (!isAuthenticated()) return router.createUrlTree(["/login"]);

  return accountInfo()?.role === "ADMIN" ? true : router.createUrlTree(["/"]);
};

export const userRouteGuard: CanActivateFn = () => {
  const router = inject(Router);
  return accountInfo()?.role === "USER"
    ? true
    : router.createUrlTree(["/admin"]);
};

export const unknownRouteGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!isAuthenticated()) return router.createUrlTree(["/login"]);

  return router.createUrlTree([
    accountInfo()?.role === "ADMIN" ? "/admin" : "/requests",
  ]);
};
