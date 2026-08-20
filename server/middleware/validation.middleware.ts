import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { clientErrorResponse, serverErrorResponse } from "../utils/responses";

const validate =
  (schema: Schema): any =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }
      return next();
    } catch (err) {
      return serverErrorResponse({ res, err, req });
    }
  };

const validateQuery =
  (schema: Schema): any =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        convert: true,
      });
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      Object.defineProperty(req, "query", {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
      return next();
    } catch (err) {
      return serverErrorResponse({ res, err, req });
    }
  };

export { validate, validateQuery };
