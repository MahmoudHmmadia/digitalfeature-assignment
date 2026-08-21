import Joi from "joi";

export type EditMyAccountDto = {
  name: string;
  avatarUrl?: string;
};

export type ToggleAccountSuspendedDto = {
  id: string;
};

export type SetAccountDeletedDto = {
  isDeleted: boolean;
};
export type AccountIdParamsDto = { id: string };
export type ListAccountsQueryDto = {
  name?: string;
  email?: string;
  isSuspended?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
  startIndex?: number;
};

export const editMyAccountSchema = Joi.object({
  name: Joi.string().required(),
  avatarUrl: Joi.string().allow("").optional(),
});

export const toggleAccountSuspendedSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const setAccountDeletedSchema = Joi.object({
  isDeleted: Joi.boolean().required(),
});
export const accountIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export const listAccountsQuerySchema = Joi.object({
  name: Joi.string().trim().allow("").optional(),
  email: Joi.string().trim().allow("").optional(),
  isSuspended: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  startIndex: Joi.number().integer().min(0).optional(),
});
