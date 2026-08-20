import Joi from "joi";

export type EditMyAccountDto = {
  name: string;
  avatarUrl: string;
};

export type ToggleAccountSuspendedDto = {
  id: string;
};

export type SetAccountDeletedDto = {
  isDeleted: boolean;
};

export const editMyAccountSchema = Joi.object({
  name: Joi.string().required(),
  avatarUrl: Joi.string().allow("").optional(),
});

export const toggleAccountSuspendedSchema = Joi.object({
  id: Joi.string().required(),
});

export const setAccountDeletedSchema = Joi.object({
  isDeleted: Joi.boolean().required(),
});
