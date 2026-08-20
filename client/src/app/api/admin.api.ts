import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";
import type { ApiEnvelope, ApiPage } from "@feedbackhub/shared";
import type { FeedbackCategory } from "../types/feedback";

export type ServerResponse<T> = ApiEnvelope<T>;
export type ServerPage<T> = ApiPage<T>;
export interface AdminAccount {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  slug: string | null;
  isSuspended: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}
export interface AdminAnalytics {
  users: { total: number; active: number; suspended: number; deleted: number };
  feedback: number;
  comments: number;
  votes: number;
  categories: number;
  feedbackByStatus: Array<{ status: number; count: number }>;
}
export interface AdminFeedback {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
  voteCount?: number;
  commentCount?: number;
  author?: { id: string; name?: string; slug?: string };
  category?: { id: string; name: string };
}
export interface AppSettings {
  id: string;
  appVersion: string;
  maintenanceMode: boolean;
  updatedAt: string;
}

@Injectable({ providedIn: "root" })
export class AdminApiService {
  private readonly api = inject(ApiService);
  getUsers(params: Record<string, string | number | boolean | undefined>) {
    return this.api.get<ServerResponse<ServerPage<AdminAccount>>>("/accounts", {
      params,
    });
  }
  toggleSuspended(id: string) {
    return this.api.post<ServerResponse<unknown>>(
      "/accounts/toggle-suspended",
      { id },
    );
  }
  setDeleted(id: string, isDeleted: boolean) {
    return this.api.patch<ServerResponse<unknown>>(`/accounts/${id}/deleted`, {
      isDeleted,
    });
  }
  getAnalytics() {
    return this.api.get<ServerResponse<AdminAnalytics>>("/admin/analytics");
  }
  getFeedback(params: Record<string, string | number | boolean | undefined>) {
    return this.api.get<ServerResponse<ServerPage<AdminFeedback>>>(
      "/feedback-requests",
      { params },
    );
  }
  deleteFeedback(id: string) {
    return this.api.delete<ServerResponse<unknown>>(`/feedback-requests/${id}`);
  }
  setPinned(id: string, pinned: boolean) {
    return this.api.patch<ServerResponse<unknown>>(
      `/feedback-requests/${id}/pin`,
      { pinned },
    );
  }
  setStatus(id: string, status: number) {
    return this.api.patch<ServerResponse<unknown>>(
      `/feedback-requests/${id}/status`,
      { status },
    );
  }
  getCategories(params: Record<string, string | number | boolean | undefined>) {
    return this.api.get<ServerResponse<ServerPage<FeedbackCategory>>>(
      "/admin/categories",
      { params },
    );
  }
  createCategory(data: { name: string; description?: string }) {
    return this.api.post<ServerResponse<FeedbackCategory>>(
      "/admin/categories",
      data,
    );
  }
  updateCategory(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.api.patch<ServerResponse<FeedbackCategory>>(
      `/admin/categories/${id}`,
      data,
    );
  }
  deleteCategory(id: string) {
    return this.api.delete<ServerResponse<FeedbackCategory>>(
      `/admin/categories/${id}`,
    );
  }
  getSettings() {
    return this.api.get<ServerResponse<AppSettings>>("/admin/settings");
  }
  updateSettings(data: Pick<AppSettings, "appVersion" | "maintenanceMode">) {
    return this.api.patch<ServerResponse<AppSettings>>("/admin/settings", data);
  }
}
