import { computed, signal } from "@angular/core";
import { getCookie, setCookie, deleteCookie } from "../lib/cookies";

export type Lang = "en" | "ar";
export type ResponseType = "success" | "error" | "warning";

export interface AccountInfo {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
  token: string;
}

export interface AppResponse {
  type: ResponseType;
  message: string;
}

function readAccount(): AccountInfo | undefined {
  const value = getCookie("feedbackhub-account");

  if (!value) return undefined;

  try {
    return JSON.parse(value) as AccountInfo;
  } catch {
    deleteCookie("feedbackhub-account");
    return undefined;
  }
}

export const lang = signal<Lang>(
  (getCookie("feedbackhub-lang") as Lang | null) ?? "en",
);

export const langLoader = signal(false);

export const accountInfo = signal<AccountInfo | undefined>(readAccount());

export const page = signal(1);

export const fcmToken = signal(getCookie("feedbackhub-fcm") ?? "");

export const response = signal<AppResponse | undefined>(undefined);

export const isAuthenticated = computed(() => Boolean(accountInfo()));

export function persistAccount(account: AccountInfo | undefined): void {
  accountInfo.set(account);

  if (account) {
    setCookie("feedbackhub-account", JSON.stringify(account));
  } else {
    deleteCookie("feedbackhub-account");
  }
}

export function persistLanguage(value: Lang): void {
  lang.set(value);
  setCookie("feedbackhub-lang", value);
}
