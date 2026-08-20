import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { accountInfo, lang, response } from "../context/global";

@Injectable({ providedIn: "root" })
export class CallsService {
  private readonly router = inject(Router);

  handleSuccess(options: {
    res?: { data?: { message?: string; materials?: unknown } };
    isLog?: boolean;
    to?: string;
  }): unknown {
    if (options.to) {
      void this.router.navigateByUrl(options.to);
    }

    if (options.isLog) {
      response.set({
        type: "success",
        message:
          options.res?.data?.message ?? (lang() === "ar" ? "تم بنجاح" : "Done"),
      });
    }

    return options.res?.data?.materials;
  }

  handleError(options: { err: unknown; isLog?: boolean }): void {
    const error = options.err as {
      response?: {
        status?: number;
        data?: { message?: string };
      };
    };

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      accountInfo.set(undefined);
    }

    if (options.isLog !== false) {
      response.set({
        type: "error",
        message:
          error?.response?.data?.message ??
          (lang() === "ar" ? "حدث خطأ ما" : "Something went wrong"),
      });
    }
  }
}
