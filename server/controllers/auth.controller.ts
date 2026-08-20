import { USER_ACCOUNT_SHAPE } from "@/constants/shapes";
import { getLang } from "@/utils/lib";
import { sendOTP, verifyOTP } from "@/utils/otp";
import { prisma } from "@/utils/prisma";
import { generateUniqueSlug } from "@/utils/slug";
import {
  LoginDto,
  RegisterDto,
  LocationQueryDto,
  RequestNewCodeDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "@/validations/auth.schemas";
import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

const USER_ROLE = 1;
const TOKEN_EXPIRY = "1d";
const OTP_EXPIRY_MS = 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildDisplayName(body: RegisterDto) {
  if (body.name?.trim()) return body.name.trim();

  return [body.firstName, body.lastName]
    .filter((part): part is string => !!part?.trim())
    .map((part) => part.trim())
    .join(" ");
}

function signAccountToken(accountId: string) {
  return jwt.sign({ id: accountId }, process.env.SECRET!, {
    expiresIn: TOKEN_EXPIRY,
  });
}

async function issueOtp(email: string) {
  const code = await sendOTP(email);

  return {
    code,
    codeExpiry: new Date(Date.now() + OTP_EXPIRY_MS),
  };
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password, fcmToken } = req.body as LoginDto;
    const normalizedEmail = normalizeEmail(email);

    const account = await prisma.account.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!account) {
      return clientErrorResponse({ message: "INVALID_CREDENTIALS", res, req });
    }

    const isMatch = await compare(password, account.password);

    if (!isMatch) {
      return clientErrorResponse({ message: "INVALID_PASSWORD", res, req });
    }

    if (account.isDeleted)
      return clientErrorResponse({ message: "ACCOUNT_DELETED", res, req });

    if (account.isSuspended)
      return clientErrorResponse({ message: "ACCOUNT_SUSPENDED", res, req });

    if (!account.isEmailVerified) {
      await prisma.account.delete({
        where: {
          id: account.id,
        },
      });
      return clientErrorResponse({ message: "INVALID_CREDENTIALS", res, req });
    }

    if (account.role === USER_ROLE) {
      const settings = await prisma.appSettings.findFirst({ select: { maintenanceMode: true } });
      if (settings?.maintenanceMode) return clientErrorResponse({ message: "MAINTENANCE_MODE", status: 503, res, req });
    }

    const token = signAccountToken(account.id);

    const data = await prisma.account.update({
      where: { id: account.id },
      data: { token, lastLogin: new Date(), fcmToken },
      select: USER_ACCOUNT_SHAPE,
    });

    return successResponse({
      res,
      data,
      req,
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const body = req.body as RegisterDto;
    const normalizedEmail = normalizeEmail(body.email);
    const displayName = buildDisplayName(body);

    const conflict = await prisma.account.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (conflict?.isDeleted) {
      return clientErrorResponse({
        message: "ACCOUNT_DELETED",
        res,
        req,
      });
    }

    if (conflict?.isEmailVerified)
      return clientErrorResponse({
        message: "ALREADY_EXISTS",
        res,
        status: 409,
        req,
      });

    if (conflict) {
      await prisma.account.delete({
        where: {
          id: conflict.id,
        },
      });
    }

    const hashPass = await hash(body.password, 10);

    const slug = await generateUniqueSlug(displayName, async (slug: string) => {
      const existing = await prisma.account.findFirst({ where: { slug } });
      return !!existing;
    });

    const otp = await issueOtp(normalizedEmail);

    await prisma.account.create({
      data: {
        email: normalizedEmail,
        password: hashPass,
        name: displayName,
        code: otp.code,
        codeExpiry: otp.codeExpiry,
        slug,
        role: USER_ROLE,
      },
    });

    return successResponse({
      res,
      req,
      message: "REGISTRATION_SUCCESSFUL",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getLocation(req: Request, res: Response) {
  try {
    const { query = "" } = req.query as LocationQueryDto;

    if (!query) {
      return clientErrorResponse({ message: "INVALID_DATA", res, req });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&limit=5&accept-language=${getLang(
        req,
      )}&namedetails=0&addressdetails=0&extratags=0`,
      {
        headers: {
          "User-Agent": "feedbackhub-app/1.0 (admin@example.com)",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return clientErrorResponse({ res, message: "LOCATION_ERROR", req });
    }

    const locations = await response.json();

    if (!Array.isArray(locations)) {
      return clientErrorResponse({ res, message: "LOCATION_ERROR", req });
    }

    const data = locations.map((item: any) => {
      const parts = item.display_name.split(", ");
      if (parts.length > 2) {
        return {
          ...item,
          lat: item.lat,
          lng: item.lon,
          display_name: `${parts[0]}, ${parts[parts.length - 2]}, ${
            parts[parts.length - 1]
          }`,
        };
      }
      return {
        ...item,
        lat: item.lat,
        lng: item.lon,
      };
    });

    return successResponse({ res, data, req });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}

export async function checkOtp(req: Request, res: Response) {
  try {
    const { email, code, fcmToken }: VerifyOtpDto = req.body;
    const normalizedEmail = normalizeEmail(email);

    const account = await prisma.account.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!account) {
      return clientErrorResponse({
        res,
        message: "INVALID_EMAIL",
        req,
      });
    }

    if (account.isDeleted)
      return clientErrorResponse({ message: "ACCOUNT_DELETED", res, req });

    if (account.isSuspended)
      return clientErrorResponse({ message: "ACCOUNT_SUSPENDED", res, req });

    const otpResult = await verifyOTP(normalizedEmail, code);

    if (!otpResult) {
      return clientErrorResponse({
        res,
        message: "VERIFICATION_CODE_EXPIRED",
        req,
      });
    }

    const token = signAccountToken(account.id);
    const data = await prisma.account.update({
      where: { id: account.id },
      data: {
        isEmailVerified: true,
        token,
        lastLogin: new Date(),
        fcmToken,
        code: null,
        codeExpiry: null,
      },
      select: USER_ACCOUNT_SHAPE,
    });

    return successResponse({
      res,
      data,
      req,
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}

export async function requestNewCode(req: Request, res: Response) {
  try {
    const { email }: RequestNewCodeDto = req.body;
    const normalizedEmail = normalizeEmail(email);

    const account = await prisma.account.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!account) {
      return clientErrorResponse({
        res,
        message: "INVALID_EMAIL",
        req,
      });
    }

    if (account.isDeleted)
      return clientErrorResponse({ message: "ACCOUNT_DELETED", res, req });

    if (account.isSuspended)
      return clientErrorResponse({ message: "ACCOUNT_SUSPENDED", res, req });

    const otp = await issueOtp(normalizedEmail);

    await prisma.account.update({
      where: { id: account.id },
      data: otp,
    });

    return successResponse({
      res,
      message: "VERIFICATION_CODE_SENT",
      req,
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, code, password }: ResetPasswordDto = req.body;
    const normalizedEmail = normalizeEmail(email);

    const account = await prisma.account.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!account) {
      return clientErrorResponse({
        res,
        message: "INVALID_EMAIL",
        req,
      });
    }

    if (account.isDeleted)
      return clientErrorResponse({ message: "ACCOUNT_DELETED", res, req });

    if (account.isSuspended)
      return clientErrorResponse({ message: "ACCOUNT_SUSPENDED", res, req });

    const otpResult = await verifyOTP(normalizedEmail, code);

    if (!otpResult) {
      return clientErrorResponse({
        res,
        message: "VERIFICATION_CODE_EXPIRED",
        req,
      });
    }

    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: await hash(password, 10),
        token: "",
        code: null,
        codeExpiry: null,
      },
    });

    return successResponse({
      res,
      message: "UPDATED_SUCCESSFULLY",
      req,
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        message: "UNAUTHORIZED",
        status: 401,
        req,
      });
    }

    await prisma.account.update({
      where: {
        id: req.account.id,
      },
      data: {
        token: "",
        fcmToken: "",
      },
    });

    return successResponse({
      res,
      message: "LOGOUT_SUCCESS",
      req,
    });
  } catch (err) {
    return serverErrorResponse({ res, err, req });
  }
}
