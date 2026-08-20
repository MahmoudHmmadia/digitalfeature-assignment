export type ThemePreference = "light" | "dark" | "system";
export interface UserPreferences {
  theme: ThemePreference;
  defaultSort: string;
  emailNotifications: boolean;
  commentNotifications: boolean;
}
const defaults: UserPreferences = {
  theme: "system",
  defaultSort: "createdAt",
  emailNotifications: true,
  commentNotifications: true,
};
export function readPreferences(): UserPreferences {
  try {
    return {
      ...defaults,
      ...(JSON.parse(
        localStorage.getItem("feedbackhub-preferences") ?? "{}",
      ) as Partial<UserPreferences>),
    };
  } catch {
    return defaults;
  }
}
export function savePreferences(value: UserPreferences): void {
  localStorage.setItem("feedbackhub-preferences", JSON.stringify(value));
  applyTheme(value.theme);
}
export function applyTheme(theme: ThemePreference): void {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}
