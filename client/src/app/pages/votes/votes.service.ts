import { Injectable, inject, signal } from "@angular/core";
import { FeedbackApiService } from "../../api/feedback.api";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../hooks/use-custom-query.service";
import type { FeedbackVote } from "../../types/feedback";
@Injectable()
export class VotesService {
  private readonly api = inject(FeedbackApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly query = inject(CustomQueryService);
  readonly votes = signal<FeedbackVote[]>([]);
  readonly loading = signal(false);
  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.votes.set(
        (await this.api.votes({ mine: true, limit: 100 })).data.materials.data,
      );
    } catch (error) {
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }
  async remove(vote: FeedbackVote): Promise<void> {
    try {
      const res = await this.api.toggleVote(vote.feedbackRequestId);
      this.mutation.success(res, { isLog: true });
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    }
  }
}
