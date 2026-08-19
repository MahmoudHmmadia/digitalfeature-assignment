import { Request, Response } from "express";
import { getLang } from "./lib";

export function serverErrorResponse({
  res,
  err,
  req,
}: {
  res: Response;
  err: any;
  req: Request;
}) {
  if (err.message.includes("Cast to ObjectId failed for value")) {
    return clientErrorResponse({
      res: res,
      message: "INVALID_ID",
      status: 400,
      req,
    });
  }
  console.log("THE SERVER ERROR: \n", err);
  return res.status(500).json({ message: err.message ? err.message : err });
}

export function clientErrorResponse({
  res,
  message,
  status = 400,
  data,
  req,
}: {
  res: Response;
  req: Request;
  message: keyof (typeof RESPONSES)["en"];
  status?: number;
  data?: any;
}) {
  return res.status(status).json({
    message:
      RESPONSES[getLang(req)][message as keyof (typeof RESPONSES)["en"]] ||
      "something went wrong",
    data,
  });
}

export function successResponse({
  res,
  data = {},
  message = "SUCCESS",
  status = 200,
  req,
}: {
  res: Response;
  data?: any;
  message?: keyof (typeof RESPONSES)["en"];
  status?: number;
  req: Request;
}) {
  return res.status(status).json({
    materials: data,
    message: RESPONSES[getLang(req)][message],
  });
}

export const RESPONSES = {
  en: {
    INVALID_ID: "invalid id",
    VERIFICATION_CODE_EXPIRED: "Verification code has expired",
    NO_PERMISSIONS_MESSAGE: "you have no permission",
    VERIFICATION_CODE_SENT: "Verification code sent successfully",
    NOT_CONFIRMED: "Incorrect verification code",
    // Success
    SUCCESS: "success response",
    // Authentication & Session
    SESSION_EXPIRED: "Session expired! Please login again",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCESS_DENIED: "Access denied",
    LOCATION_ERROR: "Error get location",

    // Validation Errors
    INVALID_EMAIL: "Invalid email address",
    INVALID_PASSWORD: "Invalid password",
    INVALID_USERNAME: "Invalid username",
    INVALID_DATE: "Invalid date",
    INVALID_URL: "Invalid URL",
    INVALID_TYPE: "Invalid type",
    INVALID_DATA: "Please provide all required information",

    // Required Fields
    REQUIRED_EMAIL: "Email is required",
    REQUIRED_PASSWORD: "Password is required",
    REQUIRED_NAME: "Name is required",
    REQUIRED_TITLE: "Title is required",
    REQUIRED_FIELD: "This field is required",

    // Operations
    CREATED_SUCCESSFULLY: "Data created successfully",
    UPDATED_SUCCESSFULLY: "Data updated successfully",
    DELETED_SUCCESSFULLY: "Data deleted successfully",
    NOT_FOUND: "Data not found",
    ALREADY_EXISTS: "Item already exists",

    // Permissions & Access
    NO_PERMISSIONS: "You don't have permission to perform this action",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden",

    // System & General
    SERVER_ERROR: "Server error. Please try again later",
    MAINTENANCE_MODE: "System under maintenance. Please try again later",
    FAILED: "Operation failed",

    ACCOUNT_DELETED: "Account has been deleted, please contact support",
    ACCOUNT_SUSPENDED: "Account has been suspended, please contact support",
    REGISTRATION_SUCCESSFUL:
      "You have been registered successfully , please check your email for verification code",
    LOGOUT_SUCCESS: "Logged out successfully",
    RATE_LIMIT_EXCEEDED:
      "You have reached the feedback submission limit. Please try again later",
    COMMENT_DELETED_SUCCESSFULLY: "The comment has been deleted successfully.",
    COMMENT_CREATED_SUCCESSFULLY: "The comment has been created successfully.",
    COMMENT_UPDATED_SUCCESSFULLY: "The comment has been updated successfully.",
    VOTED_SUCCESSFULLY: "The vote has been cast successfully.",
    UN_VOTED_SUCCESSFULLY: "The vote has been removed successfully.",
    MY_ACCOUNT_UPDATED_SUCCESSFULLY:
      "Your account has been updated successfully.",
    ACCOUNT_UN_SUSPENDED_SUCCESSFULLY:
      "Your account has been unsuspended successfully.",
    ACCOUNT_SUSPENDED_SUCCESSFULLY:
      "Your account has been suspended successfully.",
  },
  ar: {
    NO_PERMISSIONS_MESSAGE: "ليس لديك صلاحية",
    VERIFICATION_CODE_EXPIRED: "رمز التحقق منتهي الصلاحية",
    INVALID_ID: "رقم التعريف غير صالح",
    NOT_CONFIRMED: "رمز تحقق خاطئ",
    // Success
    VERIFICATION_CODE_SENT: "تم ارسال رمز التحقق بنجاح",
    SUCCESS: "تم بنجاح",
    // Authentication & Session
    SESSION_EXPIRED: "انتهت صلاحية الجلسة ، يرجى تسجيل الدخول مرة أخرى",
    INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    ACCESS_DENIED: "تم رفض الوصول",
    LOCATION_ERROR: "خطأ في الوصول للموقع",
    // Validation Errors
    INVALID_EMAIL: "البريد الإلكتروني غير صحيح",
    INVALID_PASSWORD: "كلمة المرور غير صحيحة",
    INVALID_USERNAME: "اسم المستخدم غير صحيح",
    INVALID_DATE: "تاريخ غير صحيح",
    INVALID_URL: "رابط غير صحيح",
    INVALID_TYPE: "نوع غير صحيح",
    INVALID_DATA: "يرجى تقديم جميع المعلومات المطلوبة",

    // Required Fields
    REQUIRED_EMAIL: "البريد الإلكتروني مطلوب",
    REQUIRED_PASSWORD: "كلمة المرور مطلوبة",
    REQUIRED_NAME: "الاسم مطلوب",
    REQUIRED_TITLE: "العنوان مطلوب",
    REQUIRED_FIELD: "هذا الحقل مطلوب",

    // Operations
    CREATED_SUCCESSFULLY: "تم إنشاء البيانات بنجاح",
    UPDATED_SUCCESSFULLY: "تم تحديث البيانات بنجاح",
    DELETED_SUCCESSFULLY: "تم حذف البيانات بنجاح",
    NOT_FOUND: "البيانات غير موجودة",
    ALREADY_EXISTS: "العنصر موجود مسبقاً",

    // Permissions & Access
    NO_PERMISSIONS: "ليس لديك إذن لأداء هذا الإجراء",
    UNAUTHORIZED: "وصول غير مصرح به",
    FORBIDDEN: "ممنوع",

    // System & General
    SERVER_ERROR: "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا",
    MAINTENANCE_MODE: "النظام قيد الصيانة. يرجى المحاولة مرة أخرى لاحقًا",
    FAILED: "فشلت العملية",

    ACCOUNT_DELETED: "لقد تم حذف هذا الحساب، الرجاء التواصل مع الدعم الفني",
    ACCOUNT_SUSPENDED: "لقد تم حظر هذا الحساب، الرجاء التواصل مع الدعم الفني",
    REGISTRATION_SUCCESSFUL:
      "تم تسجيلك بنجاح، يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل",
    LOGOUT_SUCCESS: "تم تسجيل الخروج بنجاح",
    RATE_LIMIT_EXCEEDED:
      "لقد وصلت إلى حد إرسال الملاحظات. يرجى المحاولة لاحقاً",
    COMMENT_DELETED_SUCCESSFULLY: "تم حذف التعليق بنجاح.",
    COMMENT_CREATED_SUCCESSFULLY: "تم إنشاء التعليق بنجاح.",
    COMMENT_UPDATED_SUCCESSFULLY: "تم تحديث التعليق بنجاح.",
    VOTED_SUCCESSFULLY: "تم تسجيل التصويت بنجاح.",
    UN_VOTED_SUCCESSFULLY: "تم إلغاء التصويت بنجاح.",
    MY_ACCOUNT_UPDATED_SUCCESSFULLY: "تم تحديث بيانات الحساب بنجاح.",
    ACCOUNT_UN_SUSPENDED_SUCCESSFULLY: "تم إلغاء حظر الحساب بنجاح.",
    ACCOUNT_SUSPENDED_SUCCESSFULLY: "تم حظر الحساب بنجاح.",
  },
};
