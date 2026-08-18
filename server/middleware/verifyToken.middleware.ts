import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/lib";
import { prisma } from "../utils/prisma";
import { clientErrorResponse, serverErrorResponse } from "../utils/responses";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const token = getToken(req);

    jwt.verify(token!, process.env.SECRET!, async (err, decoded) => {
      if (err) {
        return clientErrorResponse({
          res,
          message: "SESSION_EXPIRED",
          status: 403,
          req,
        });
      } else {
        const account = await prisma.account.findUnique({
          where: { id: (decoded as any)?.id },
        });

        if (!account || account.token != token)
          return clientErrorResponse({
            res,
            message: "SESSION_EXPIRED",
            status: 403,
            req,
          });
        req.account = account;

        return next();
      }
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}
