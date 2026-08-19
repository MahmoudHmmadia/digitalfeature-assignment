import { Express, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

export const API_PREFIX = "/api";

const REF = String.fromCharCode(36) + "ref";
const ref = (value: string) => ({ [REF]: value });

const json = (schema: unknown) => ({
  "application/json": {
    schema,
  },
});

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "FeedbackHub Backend API",
    version: "1.0.0",
    description:
      "REST API for FeedbackHub authentication, OTP verification, and account session workflows.",
    contact: {
      name: "FeedbackHub API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local development",
    },
  ],
  tags: [
    {
      name: "System",
      description: "Service health and diagnostics.",
    },
    {
      name: "Authentication",
      description: "Email registration, OTP verification, login, and sessions.",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    parameters: {
      AcceptLanguage: {
        name: "Accept-Language",
        in: "header",
        required: false,
        schema: { type: "string", enum: ["en", "ar"], default: "en" },
        description: "Response language.",
      },
    },
    schemas: {
      ApiMessage: {
        type: "object",
        properties: {
          message: { type: "string", example: "success response" },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid email or password" },
          data: { nullable: true },
        },
      },
      Account: {
        type: "object",
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de11" },
          email: { type: "string", format: "email", example: "user@example.com" },
          name: { type: "string", nullable: true, example: "John Doe" },
          avatarUrl: { type: "string", nullable: true, example: null },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          fcmToken: { type: "string", nullable: true, example: null },
          slug: { type: "string", nullable: true, example: "john-doe" },
          role: { type: "integer", enum: [0, 1], example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          lastLogin: { type: "string", format: "date-time", nullable: true },
        },
      },
      AccountResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/Account"),
          message: { type: "string", example: "success response" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", minLength: 8, example: "Password123" },
          name: { type: "string", minLength: 2, example: "John Doe" },
          firstName: { type: "string", minLength: 1, example: "John" },
          lastName: { type: "string", minLength: 1, example: "Doe" },
          phoneNumber: { type: "string", example: "+15551234567" },
          location: {
            type: "object",
            properties: {
              lat: { type: "number", example: 33.5138 },
              lng: { type: "number", example: 36.2765 },
              display_name: { type: "string", example: "Damascus, Syria" },
            },
          },
        },
        anyOf: [{ required: ["name"] }, { required: ["firstName"] }],
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", example: "Password123" },
          fcmToken: { type: "string", example: "firebase-device-token" },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["email", "code"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          code: { type: "string", minLength: 6, maxLength: 6, example: "000000" },
          fcmToken: { type: "string", example: "firebase-device-token" },
        },
      },
      RequestNewCodeRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email", "code", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          code: { type: "string", minLength: 6, maxLength: 6, example: "000000" },
          password: { type: "string", minLength: 8, example: "NewPassword123" },
        },
      },
      LocationResult: {
        type: "object",
        properties: {
          display_name: { type: "string", example: "Damascus, Syria" },
          lat: { type: "string", example: "33.5138" },
          lng: { type: "string", example: "36.2765" },
        },
        additionalProperties: true,
      },
      LocationResponse: {
        type: "object",
        properties: {
          materials: {
            type: "array",
            items: ref("#/components/schemas/LocationResult"),
          },
          message: { type: "string", example: "success response" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "OK" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Validation or client error",
        content: json(ref("#/components/schemas/ApiError")),
      },
      Unauthorized: {
        description: "Missing, invalid, or expired access token",
        content: json(ref("#/components/schemas/ApiError")),
      },
      Conflict: {
        description: "Resource already exists",
        content: json(ref("#/components/schemas/ApiError")),
      },
      ServerError: {
        description: "Unexpected server error",
        content: json(ref("#/components/schemas/ApiError")),
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Check API health",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Service is running",
            content: json(ref("#/components/schemas/HealthResponse")),
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new account",
        description:
          "Creates an unverified account and sends a six-digit email verification code.",
        operationId: "registerAccount",
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/RegisterRequest")),
        },
        responses: {
          "200": {
            description: "Account created and verification code sent",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "409": ref("#/components/responses/Conflict"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/check-code": {
      post: {
        tags: ["Authentication"],
        summary: "Verify email OTP",
        description:
          "Verifies the email code and returns the authenticated account with a JWT token.",
        operationId: "verifyEmailCode",
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/VerifyOtpRequest")),
        },
        responses: {
          "200": {
            description: "Email verified and session token issued",
            content: json(ref("#/components/schemas/AccountResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email and password",
        operationId: "loginAccount",
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/LoginRequest")),
        },
        responses: {
          "200": {
            description: "Authenticated account and JWT token",
            content: json(ref("#/components/schemas/AccountResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/new-code": {
      post: {
        tags: ["Authentication"],
        summary: "Request a new verification code",
        operationId: "requestNewVerificationCode",
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/RequestNewCodeRequest")),
        },
        responses: {
          "200": {
            description: "New verification code sent",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with OTP",
        operationId: "resetPassword",
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/ResetPasswordRequest")),
        },
        responses: {
          "200": {
            description: "Password updated",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout current account",
        operationId: "logoutAccount",
        security: [{ bearerAuth: [] }],
        parameters: [ref("#/components/parameters/AcceptLanguage")],
        responses: {
          "200": {
            description: "Session revoked",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/auth/location": {
      get: {
        tags: ["Authentication"],
        summary: "Search locations",
        operationId: "searchLocations",
        parameters: [
          ref("#/components/parameters/AcceptLanguage"),
          {
            name: "query",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1 },
            example: "Damascus",
          },
        ],
        responses: {
          "200": {
            description: "Matching locations",
            content: json(ref("#/components/schemas/LocationResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
  },
} as const;

function swaggerContentSecurityPolicy(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "font-src 'self' https: data:",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data:",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline'",
      "script-src-attr 'none'",
      "style-src 'self' https: 'unsafe-inline'",
    ].join(";"),
  );

  next();
}

export function configureSwaggerDocs(server: Express) {
  server.get("/api-docs.json", (_req, res) => res.json(swaggerDocument));

  server.use(
    "/api-docs",
    swaggerContentSecurityPolicy,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "FeedbackHub API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tagsSorter: "alpha",
        operationsSorter: "method",
      },
    }),
  );
}
