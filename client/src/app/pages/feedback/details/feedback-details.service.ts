import { Injectable, inject, signal } from "@angular/core";
import { FeedbackApiService } from "../../../api/feedback.api";
import { CustomMutationService } from "../../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../../hooks/use-custom-query.service";
import type { FeedbackComment, FeedbackRequest } from "../../../types/feedback";
@Injectable()
export class FeedbackDetailsService {
  private readonly api = inject(FeedbackApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly query = inject(CustomQueryService);
  readonly item = signal<FeedbackRequest | null>(null);
  readonly comments = signal<FeedbackComment[]>([]);
  readonly loading = signal(false);
  readonly commentLoading = signal(false);
  readonly content = signal("");
  readonly editingId = signal<string | null>(null);
  async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const [item, comments] = await Promise.all([
        this.api.get(id),
        this.api.comments({ feedbackRequestId: id, limit: 100 }),
      ]);
      this.item.set(item.data.materials);
      this.comments.set(comments.data.materials.data);
    } catch (error) {
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
  startEdit(comment: FeedbackComment): void {
    this.editingId.set(comment.id);
    this.content.set(comment.content);
  }
  cancelEdit(): void {
    this.editingId.set(null);
    this.content.set("");
  }
  async saveComment(): Promise<void> {
    const item = this.item();
    const content = this.content().trim();
    if (!item || !content) return;
    this.commentLoading.set(true);
    try {
      const res = this.editingId()
        ? await this.api.updateComment(this.editingId()!, content)
        : await this.api.createComment(item.id, content);
      this.mutation.success(res, { isLog: true });
      this.cancelEdit();
      await this.load(item.id);
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.commentLoading.set(false);
    }
  }
  async deleteComment(comment: FeedbackComment): Promise<void> {
    try {
      const res = await this.api.removeComment(comment.id);
      this.mutation.success(res, { isLog: true });
      await this.load(this.item()!.id);
    } catch (error) {
      this.mutation.error(error);
    }
  }
  async vote(): Promise<void> {
    const item = this.item();
    if (!item) return;
    try {
      const res = await this.api.toggleVote(item.id);
      this.mutation.success(res, { isLog: true });
      await this.load(item.id);
    } catch (error) {
      this.mutation.error(error);
    }
  }
}
