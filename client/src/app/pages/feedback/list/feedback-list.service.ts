import { Injectable, inject, signal } from "@angular/core";
import { FeedbackApiService } from "../../../api/feedback.api";
import { CustomMutationService } from "../../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../../hooks/use-custom-query.service";
import type {
  FeedbackCategory,
  FeedbackRequest,
} from "../../../types/feedback";
import type { FeedbackFilters } from "../components/feedback-filter.component";
import { readPreferences } from "../../../lib/preferences";
@Injectable()
export class FeedbackListService {
  private readonly api = inject(FeedbackApiService);
  private readonly query = inject(CustomQueryService);
  private readonly mutation = inject(CustomMutationService);
  readonly items = signal<FeedbackRequest[]>([]);
  readonly categories = signal<FeedbackCategory[]>([]);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly filters = signal<FeedbackFilters>({
    search: "",
    sortBy: "createdAt",
  });
  readonly mineOnly = signal(false);
  async init(mine = false): Promise<void> {
    this.mineOnly.set(mine);
    this.filters.update((value) => ({
      ...value,
      sortBy: readPreferences().defaultSort,
    }));
    await this.load();
  }
  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const params = {
        ...this.filters(),
        page: this.page(),
        limit: 10,
        sortOrder: "desc",
      };
      const res = this.mineOnly()
        ? await this.api.mine(params)
        : await this.api.list(params);
      const result = res.data.materials;
      this.items.set(result.data);
      this.pages.set(Math.max(result.pagesNumber, 1));
      this.total.set(result.totalCount);
    } catch (error) {
      this.error.set(true);
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
  async apply(filters: FeedbackFilters): Promise<void> {
    this.filters.set(filters);
    this.page.set(1);
    await this.load();
  }
  async goTo(page: number): Promise<void> {
    if (page < 1 || page > this.pages()) return;
    this.page.set(page);
    await this.load();
  }
  async vote(item: FeedbackRequest): Promise<void> {
    try {
      const res = await this.api.toggleVote(item.id);
      this.mutation.success(res, { isLog: true });
      await this.query.invalidate(["feedback"]);
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    }
  }
  async remove(item: FeedbackRequest): Promise<void> {
    try {
      const res = await this.api.remove(item.id);
      this.mutation.success(res, { isLog: true });
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    }
  }
}
