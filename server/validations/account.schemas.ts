import Joi from "joi";

export type EditMyAccountDto = {
  name: string;
  avatarUrl: string;
};

export type ToggleAccountSuspendedDto = {
  id: string;
};

export const editMyAccountSchema = Joi.object({
  name: Joi.string().required(),
  avatarUrl: Joi.string().required(),
});

export const toggleAccountSuspendedSchema = Joi.object({
  id: Joi.string().required(),
});
