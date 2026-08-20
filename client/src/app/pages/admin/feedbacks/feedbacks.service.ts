import { Injectable, inject, signal } from "@angular/core";
import { AdminApiService, type AdminFeedback } from "../../../api/admin.api";
import { CustomMutationService } from "../../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../../hooks/use-custom-query.service";

@Injectable()
export class AdminFeedbacksService {
  private readonly api = inject(AdminApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly query = inject(CustomQueryService);
  readonly items = signal<AdminFeedback[]>([]);
  readonly loading = signal(false);
  readonly mutatingId = signal<string | null>(null);
  readonly error = signal(false);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly search = signal("");
  readonly pinned = signal<"all" | "pinned" | "regular">("all");
  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const pin = this.pinned();
      const res = await this.api.getFeedback({
        page: this.page(),
        limit: 10,
        search: this.search() || undefined,
        pinned: pin === "all" ? undefined : pin === "pinned",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      const result = res.data.materials;
      this.items.set(result.data);
      this.pages.set(Math.max(1, result.pagesNumber));
      this.total.set(result.totalCount);
    } catch (error) {
      this.error.set(true);
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
  async applyFilters(
    search: string,
    pinned: "all" | "pinned" | "regular",
  ): Promise<void> {
    this.search.set(search.trim());
    this.pinned.set(pinned);
    this.page.set(1);
    await this.load();
  }
  async goTo(page: number): Promise<void> {
    if (page < 1 || page > this.pages()) return;
    this.page.set(page);
    await this.load();
  }
  async pin(item: AdminFeedback): Promise<void> {
    await this.mutate(item.id, () => this.api.setPinned(item.id, !item.pinned));
  }
  async remove(item: AdminFeedback): Promise<void> {
    await this.mutate(item.id, () => this.api.deleteFeedback(item.id));
  }
  private async mutate(
    id: string,
    call: () => ReturnType<AdminApiService["deleteFeedback"]>,
  ): Promise<void> {
    this.mutatingId.set(id);
    try {
      const res = await call();
      this.mutation.success(res, { isLog: true });
      await this.query.invalidate(["admin-feedback"]);
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.mutatingId.set(null);
    }
  }
}
