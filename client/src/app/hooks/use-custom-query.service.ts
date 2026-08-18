import { Injectable, inject } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { CallsService } from './use-calls.service';

@Injectable({ providedIn: 'root' })
export class CustomQueryService {
  private readonly queryClient = inject(QueryClient);
  private readonly calls = inject(CallsService);

  invalidate(queryKey: readonly unknown[]): Promise<void> {
    return this.queryClient.invalidateQueries({ queryKey });
  }

  handleError(error: unknown, isLog = true): void {
    this.calls.handleError({ err: error, isLog });
  }
}
