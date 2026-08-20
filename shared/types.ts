export type AppRole = "USER" | "ADMIN";
export interface ApiEnvelope<T> {
  materials: T;
  message: string;
}
export interface ApiPage<T> {
  data: T[];
  totalCount: number;
  pagesNumber: number;
}
export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface FeedbackAuthor {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  slug?: string | null;
}
export interface FeedbackRequestContract {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
  authorId: string;
  author?: FeedbackAuthor;
  categoryId: string;
  category: FeedbackCategory;
  status: number;
  voteCount: number;
  commentCount: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface FeedbackCommentContract {
  id: string;
  content: string;
  authorId: string;
  author?: FeedbackAuthor;
  feedbackRequestId: string;
  feedbackRequest?: { id: string; title: string };
  createdAt: string;
  updatedAt: string;
}
export interface FeedbackVoteContract {
  id: string;
  authorId: string;
  feedbackRequestId: string;
  createdAt: string;
  feedbackRequest: FeedbackRequestContract;
}
export interface CreateFeedbackRequestContract {
  title: string;
  description: string;
  categoryId: string;
}
export interface EditFeedbackRequestContract {
  title?: string;
  description?: string;
  categoryId?: string;
}
export interface ListFeedbackRequestsContract {
  search?: string;
  categoryId?: string;
  status?: number;
  authorId?: string;
  pinned?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "title" | "votes";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  startIndex?: number;
}
export interface CategoryListContract {
  search?: string;
  page?: number;
  limit?: number;
  startIndex?: number;
}
