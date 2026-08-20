import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";
import type {
  FeedbackCategory,
  FeedbackComment,
  FeedbackRequest,
  FeedbackVote,
} from "../types/feedback";
import type { ApiEnvelope, ApiPage } from "@feedbackhub/shared";
export type { ApiEnvelope, ApiPage } from "@feedbackhub/shared";
@Injectable({ providedIn: "root" })
export class FeedbackApiService {
  private readonly api = inject(ApiService);
  list(params: Record<string, unknown> = {}) {
    return this.api.get<ApiEnvelope<ApiPage<FeedbackRequest>>>(
      "/feedback-requests",
      { params },
    );
  }
  mine(params: Record<string, unknown> = {}) {
    return this.api.get<ApiEnvelope<ApiPage<FeedbackRequest>>>(
      "/feedback-requests/mine",
      { params },
    );
  }
  get(id: string) {
    return this.api.get<ApiEnvelope<FeedbackRequest>>(
      `/feedback-requests/${id}`,
    );
  }
  create(data: { title: string; description: string; categoryId: string }) {
    return this.api.post<ApiEnvelope<FeedbackRequest>>(
      "/feedback-requests",
      data,
    );
  }
  update(
    id: string,
    data: { title: string; description: string; categoryId: string },
  ) {
    return this.api.patch<ApiEnvelope<FeedbackRequest>>(
      `/feedback-requests/${id}`,
      data,
    );
  }
  remove(id: string) {
    return this.api.delete<ApiEnvelope<unknown>>(`/feedback-requests/${id}`);
  }
  categories(params: Record<string, unknown> = {}) {
    return this.api.get<ApiEnvelope<ApiPage<FeedbackCategory>>>("/categories", {
      params,
    });
  }
  toggleVote(feedbackRequestId: string) {
    return this.api.post<ApiEnvelope<unknown>>("/votes", { feedbackRequestId });
  }
  votes(params: Record<string, unknown> = {}) {
    return this.api.get<ApiEnvelope<ApiPage<FeedbackVote>>>("/votes", {
      params,
    });
  }
  comments(params: Record<string, unknown> = {}) {
    return this.api.get<ApiEnvelope<ApiPage<FeedbackComment>>>("/comments", {
      params,
    });
  }
  createComment(feedbackRequestId: string, content: string) {
    return this.api.post<ApiEnvelope<unknown>>("/comments", {
      feedbackRequestId,
      content,
    });
  }
  updateComment(id: string, content: string) {
    return this.api.patch<ApiEnvelope<unknown>>("/comments", { id, content });
  }
  removeComment(id: string) {
    return this.api.delete<ApiEnvelope<unknown>>(`/comments/${id}`);
  }
  updateProfile(data: FormData) {
    return this.api.patch<
      ApiEnvelope<{ id: string; name: string; avatarUrl?: string }>
    >("/accounts", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteAccount() {
    return this.api.delete<ApiEnvelope<unknown>>("/accounts");
  }
}
