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
} as const

export const PUBLIC_ACCOUNT_SHAPE = {
  id: true,
  name: true,
  avatarUrl: true,
  slug: true,
} as const

export const ADMIN_ROLE = 0
export const USER_ROLE = 1
