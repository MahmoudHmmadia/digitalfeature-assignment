import Joi from "joi";

export const locationString = Joi.string().custom((value, helpers) => {
  let parsedValue;

  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    return helpers.error("string.json");
  }

  if (typeof parsedValue != "object" || !parsedValue.lat || !parsedValue.lng) {
    return helpers.error("object.missingLatLng");
  }

  return value;
}, "JSON String Validation");

export type LoginDto = {
  email: string;
  password: string;
  fcmToken?: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
    display_name?: string;
  };
};
export type LocationQueryDto = { query?: string };

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  fcmToken: Joi.string().optional(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().trim().min(2).optional(),
  firstName: Joi.string().trim().min(1).optional(),
  lastName: Joi.string().trim().min(1).optional(),
  phoneNumber: Joi.string().trim().optional(),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    display_name: Joi.string().optional(),
  }).optional(),
})
  .or("name", "firstName")
  .messages({
    "object.missing": "Name or firstName is required",
  });

export type VerifyOtpDto = {
  fcmToken?: string;
  email: string;
  code: string;
};

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "Verification code must be 6 digits",
    "any.required": "Verification code is required",
  }),

  fcmToken: Joi.string().optional(),
});

export type RequestNewCodeDto = {
  email: string;
};

export const newOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

export type ResetPasswordDto = {
  email: string;
  code: string;
  password: string;
};

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "Verification code must be 6 digits",
    "any.required": "Verification code is required",
  }),
  password: Joi.string().min(8).required(),
});
export const locationQuerySchema = Joi.object({ query: Joi.string().trim().allow('').max(200).optional() });
