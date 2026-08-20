export const USER_ACCOUNT_SHAPE = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  token: true,
  fcmToken: true,
  slug: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

export const PUBLIC_ACCOUNT_SHAPE = {
  id: true,
  name: true,
  avatarUrl: true,
  slug: true,
  isSuspended: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

export const ADMIN_ROLE = 0;
export const USER_ROLE = 1;

export const COMMENT_SHAPE = {
  id: true,
  content: true,
  feedbackRequestId: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: PUBLIC_ACCOUNT_SHAPE },
  feedbackRequest: { select: { id: true, title: true } },
};

export const VOTE_SHAPE = {
  id: true,
  feedbackRequestId: true,
  authorId: true,
  createdAt: true,
  author: { select: PUBLIC_ACCOUNT_SHAPE },
  feedbackRequest: {
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      pinned: true,
      createdAt: true,
      category: true,
      _count: { select: { votes: true, comments: true } },
    },
  },
};
