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
    {
      name: "Accounts",
      description: "Account profile and administration operations.",
    },
    {
      name: "Feedback Requests",
      description: "Create, discover, and manage product feedback requests.",
    },
    {
      name: "Comments",
      description: "Discussion comments attached to feedback requests.",
    },
    {
      name: "Votes",
      description: "Vote and withdraw votes on feedback requests.",
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
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
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
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
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
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: { type: "string", example: "Password123" },
          fcmToken: { type: "string", example: "firebase-device-token" },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["email", "code"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          code: {
            type: "string",
            minLength: 6,
            maxLength: 6,
            example: "000000",
          },
          fcmToken: { type: "string", example: "firebase-device-token" },
        },
      },
      RequestNewCodeRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email", "code", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          code: {
            type: "string",
            minLength: 6,
            maxLength: 6,
            example: "000000",
          },
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
      PublicAccount: {
        type: "object",
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de11" },
          name: { type: "string", example: "John Doe" },
          avatarUrl: { type: "string", nullable: true },
          slug: { type: "string", nullable: true, example: "john-doe" },
          isSuspended: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          lastLogin: { type: "string", format: "date-time", nullable: true },
        },
      },
      FeedbackRequest: {
        type: "object",
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de11" },
          title: { type: "string", example: "Add dark mode" },
          description: { type: "string", example: "Support a dark theme." },
          categoryId: { type: "string", example: "66d8f35a7b2c1c001a82de22" },
          status: { type: "integer", example: 0 },
          pinned: { type: "boolean", example: false },
          voteCount: { type: "integer", example: 12 },
          commentCount: { type: "integer", example: 3 },
          hasVoted: { type: "boolean", example: true },
          author: ref("#/components/schemas/PublicAccount"),
          category: { type: "object", additionalProperties: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de33" },
          content: { type: "string", example: "This would be useful." },
          feedbackRequestId: { type: "string" },
          author: ref("#/components/schemas/PublicAccount"),
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Vote: {
        type: "object",
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de44" },
          author: ref("#/components/schemas/PublicAccount"),
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedAccounts: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: ref("#/components/schemas/PublicAccount"),
          },
          totalCount: { type: "integer", example: 25 },
          pagesNumber: { type: "integer", example: 3 },
        },
      },
      PaginatedFeedbackRequests: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: ref("#/components/schemas/FeedbackRequest"),
          },
          totalCount: { type: "integer", example: 25 },
          pagesNumber: { type: "integer", example: 3 },
        },
      },
      PaginatedComments: {
        type: "object",
        properties: {
          data: { type: "array", items: ref("#/components/schemas/Comment") },
          totalCount: { type: "integer", example: 25 },
          pagesNumber: { type: "integer", example: 3 },
        },
      },
      PaginatedVotes: {
        type: "object",
        properties: {
          data: { type: "array", items: ref("#/components/schemas/Vote") },
          totalCount: { type: "integer", example: 25 },
          pagesNumber: { type: "integer", example: 3 },
        },
      },
      FeedbackRequestResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/FeedbackRequest"),
          message: { type: "string", example: "success response" },
        },
      },
      AccountListResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/PaginatedAccounts"),
          message: { type: "string", example: "success response" },
        },
      },
      FeedbackRequestListResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/PaginatedFeedbackRequests"),
          message: { type: "string", example: "success response" },
        },
      },
      CommentListResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/PaginatedComments"),
          message: { type: "string", example: "success response" },
        },
      },
      VoteListResponse: {
        type: "object",
        properties: {
          materials: ref("#/components/schemas/PaginatedVotes"),
          message: { type: "string", example: "success response" },
        },
      },
      EditAccountRequest: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", example: "John Doe" } },
      },
      ToggleAccountSuspendedRequest: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de11" },
        },
      },
      CreateFeedbackRequest: {
        type: "object",
        required: ["title", "description", "categoryId"],
        properties: {
          title: { type: "string", minLength: 3, maxLength: 120 },
          description: { type: "string", minLength: 1, maxLength: 5000 },
          categoryId: { type: "string", minLength: 24, maxLength: 24 },
        },
      },
      EditFeedbackRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", minLength: 3, maxLength: 120 },
          description: { type: "string", minLength: 1, maxLength: 5000 },
          categoryId: { type: "string", minLength: 24, maxLength: 24 },
        },
      },
      ChangeFeedbackStatusRequest: {
        type: "object",
        required: ["statusId"],
        properties: {
          statusId: { type: "string", minLength: 24, maxLength: 24 },
        },
      },
      PinFeedbackRequest: {
        type: "object",
        required: ["pinned"],
        properties: { pinned: { type: "boolean", example: true } },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["content", "feedbackRequestId"],
        properties: {
          content: { type: "string", example: "This would be useful." },
          feedbackRequestId: {
            type: "string",
            example: "66d8f35a7b2c1c001a82de11",
          },
        },
      },
      EditCommentRequest: {
        type: "object",
        required: ["id", "content"],
        properties: {
          id: { type: "string", example: "66d8f35a7b2c1c001a82de33" },
          content: { type: "string", example: "Updated comment." },
        },
      },
      ToggleVoteRequest: {
        type: "object",
        required: ["feedbackRequestId"],
        properties: { feedbackRequestId: { type: "string" } },
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
    "/accounts": {
      get: {
        tags: ["Accounts"],
        summary: "List accounts",
        operationId: "listAccounts",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "name", in: "query", schema: { type: "string" } },
          { name: "email", in: "query", schema: { type: "string" } },
          { name: "isSuspended", in: "query", schema: { type: "boolean" } },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 10 },
          },
          {
            name: "startIndex",
            in: "query",
            schema: { type: "integer", minimum: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated account list",
            content: json(ref("#/components/schemas/AccountListResponse")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      patch: {
        tags: ["Accounts"],
        summary: "Update my account",
        operationId: "updateMyAccount",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  avatar: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Account updated",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/accounts/toggle-suspended": {
      post: {
        tags: ["Accounts"],
        summary: "Toggle an account suspension",
        operationId: "toggleAccountSuspended",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json(
            ref("#/components/schemas/ToggleAccountSuspendedRequest"),
          ),
        },
        responses: {
          "200": {
            description: "Account suspension updated",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/feedback-requests": {
      get: {
        tags: ["Feedback Requests"],
        summary: "List feedback requests",
        operationId: "listFeedbackRequests",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "categoryId",
            in: "query",
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
          {
            name: "statusId",
            in: "query",
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
          {
            name: "authorId",
            in: "query",
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
          { name: "pinned", in: "query", schema: { type: "boolean" } },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["createdAt", "updatedAt", "title", "votes"],
            },
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"] },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: "startIndex",
            in: "query",
            schema: { type: "integer", minimum: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated feedback requests",
            content: json(
              ref("#/components/schemas/FeedbackRequestListResponse"),
            ),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      post: {
        tags: ["Feedback Requests"],
        summary: "Create a feedback request",
        operationId: "createFeedbackRequest",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/CreateFeedbackRequest")),
        },
        responses: {
          "201": {
            description: "Feedback request created",
            content: json(ref("#/components/schemas/FeedbackRequestResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/feedback-requests/mine": {
      get: {
        tags: ["Feedback Requests"],
        summary: "List my feedback requests",
        operationId: "listMyFeedbackRequests",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: "startIndex",
            in: "query",
            schema: { type: "integer", minimum: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated personal feedback requests",
            content: json(
              ref("#/components/schemas/FeedbackRequestListResponse"),
            ),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/feedback-requests/{id}": {
      get: {
        tags: ["Feedback Requests"],
        summary: "Get a feedback request",
        operationId: "getFeedbackRequest",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        responses: {
          "200": {
            description: "Feedback request details",
            content: json(ref("#/components/schemas/FeedbackRequestResponse")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      patch: {
        tags: ["Feedback Requests"],
        summary: "Update a feedback request",
        operationId: "updateFeedbackRequest",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/EditFeedbackRequest")),
        },
        responses: {
          "200": {
            description: "Feedback request updated",
            content: json(ref("#/components/schemas/FeedbackRequestResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      delete: {
        tags: ["Feedback Requests"],
        summary: "Delete a feedback request",
        operationId: "deleteFeedbackRequest",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        responses: {
          "200": {
            description: "Feedback request deleted",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/feedback-requests/{id}/status": {
      patch: {
        tags: ["Feedback Requests"],
        summary: "Change feedback request status",
        operationId: "changeFeedbackRequestStatus",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        requestBody: {
          required: true,
          content: json(
            ref("#/components/schemas/ChangeFeedbackStatusRequest"),
          ),
        },
        responses: {
          "200": {
            description: "Status updated",
            content: json(ref("#/components/schemas/FeedbackRequestResponse")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/feedback-requests/{id}/pin": {
      patch: {
        tags: ["Feedback Requests"],
        summary: "Pin or unpin a feedback request",
        operationId: "pinFeedbackRequest",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/PinFeedbackRequest")),
        },
        responses: {
          "200": {
            description: "Pin state updated",
            content: json(ref("#/components/schemas/FeedbackRequest")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/comments": {
      get: {
        tags: ["Comments"],
        summary: "List comments",
        operationId: "listComments",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "feedbackRequestId",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 10 },
          },
          {
            name: "startIndex",
            in: "query",
            schema: { type: "integer", minimum: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated comments",
            content: json(ref("#/components/schemas/CommentListResponse")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Create a comment",
        operationId: "createComment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/CreateCommentRequest")),
        },
        responses: {
          "200": {
            description: "Comment created",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      patch: {
        tags: ["Comments"],
        summary: "Edit a comment",
        operationId: "editComment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/EditCommentRequest")),
        },
        responses: {
          "200": {
            description: "Comment updated",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/comments/{id}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        operationId: "deleteComment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 24, maxLength: 24 },
          },
        ],
        responses: {
          "200": {
            description: "Comment deleted",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "404": ref("#/components/responses/BadRequest"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
    },
    "/votes": {
      get: {
        tags: ["Votes"],
        summary: "List votes",
        operationId: "listVotes",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "feedbackRequestId",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 10 },
          },
          {
            name: "startIndex",
            in: "query",
            schema: { type: "integer", minimum: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated votes",
            content: json(ref("#/components/schemas/VoteListResponse")),
          },
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
          "500": ref("#/components/responses/ServerError"),
        },
      },
      post: {
        tags: ["Votes"],
        summary: "Toggle a vote",
        operationId: "toggleVote",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: json(ref("#/components/schemas/ToggleVoteRequest")),
        },
        responses: {
          "200": {
            description: "Vote created or removed",
            content: json(ref("#/components/schemas/ApiMessage")),
          },
          "400": ref("#/components/responses/BadRequest"),
          "401": ref("#/components/responses/Unauthorized"),
          "403": ref("#/components/responses/Unauthorized"),
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
