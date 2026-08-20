import { Injectable, inject, signal } from "@angular/core";
import { FeedbackApiService } from "../../api/feedback.api";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../hooks/use-custom-query.service";
import type { FeedbackComment } from "../../types/feedback";
@Injectable()
export class CommentsService {
  private readonly api = inject(FeedbackApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly query = inject(CustomQueryService);
  readonly comments = signal<FeedbackComment[]>([]);
  readonly loading = signal(false);
  readonly editing = signal<FeedbackComment | null>(null);
  readonly content = signal("");
  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.comments.set(
        (await this.api.comments({ mine: true, limit: 100 })).data.materials
          .data,
      );
    } catch (error) {
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
  start(item: FeedbackComment): void {
    this.editing.set(item);
    this.content.set(item.content);
  }
  cancel(): void {
    this.editing.set(null);
    this.content.set("");
  }
  async save(): Promise<void> {
    const item = this.editing();
    if (!item || !this.content().trim()) return;
    try {
      const res = await this.api.updateComment(item.id, this.content().trim());
      this.mutation.success(res, { isLog: true });
      this.cancel();
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    }
  }
  async remove(item: FeedbackComment): Promise<void> {
    try {
      const res = await this.api.removeComment(item.id);
      this.mutation.success(res, { isLog: true });
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    }
  }
}
