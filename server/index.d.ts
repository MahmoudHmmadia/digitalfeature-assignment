import type { Account } from '@prisma/client'

export {}

declare global {
  namespace Express {
    interface Request {
      account?: Account
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    account?: Account
  }
}
