import { Injectable, inject, signal } from "@angular/core";
import { AdminApiService, type AdminAnalytics } from "../../../api/admin.api";
import { CustomQueryService } from "../../../hooks/use-custom-query.service";

@Injectable()
export class AdminOverviewService {
  private readonly api = inject(AdminApiService);
  private readonly query = inject(CustomQueryService);
  readonly analytics = signal<AdminAnalytics | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const response = await this.api.getAnalytics();
      this.analytics.set(response.data.materials);
    } catch (error) {
      this.error.set(true);
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
}
