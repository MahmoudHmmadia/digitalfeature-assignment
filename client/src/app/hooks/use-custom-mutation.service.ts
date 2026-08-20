import { Injectable, inject } from "@angular/core";
import { CallsService } from "./use-calls.service";

@Injectable({ providedIn: "root" })
export class CustomMutationService {
  private readonly calls = inject(CallsService);

  success(
    responseData: { data?: { message?: string; materials?: unknown } },
    options?: { isLog?: boolean; to?: string },
  ): unknown {
    return this.calls.handleSuccess({
      res: responseData,
      isLog: options?.isLog,
      to: options?.to,
    });
  }

  error(error: unknown, isLog = true): void {
    this.calls.handleError({ err: error, isLog });
  }
}
