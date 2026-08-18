export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface FeedbackStatus {
  id: string;
  name: string;
  description?: string;
  position: number;
  isActive: boolean;
}

export interface FeedbackRequest {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  categoryId: string;
  category: FeedbackCategory;
  statusId: string;
  status: FeedbackStatus;
  voteCount: number;
  commentCount: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackComment {
  id: string;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  feedbackRequestId: string;
  createdAt: string;
  updatedAt: string;
}
