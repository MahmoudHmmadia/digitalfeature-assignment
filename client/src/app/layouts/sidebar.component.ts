import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";
import { linksForRole, type NavLink } from "../constants/links";
import { accountInfo, persistAccount } from "../context/global";
import { cn } from "../lib/utils";
import { ConfirmationDialogComponent } from "../components/confirmation-dialog.component";
import { TranslatorService } from "../lang/translator.service";
import type { TranslatorKey } from "../lang/translator";
import { LanguageSwitcherComponent } from "../components/language-switcher.component";
import { ButtonComponent } from "../components/ui/button.component";
import { AuthApiService } from "../api/auth.api";
import { AvatarMenuComponent } from "../components/avatar-menu.component";

const navTranslationKeys: Record<string, TranslatorKey> = {
  "Admin Overview": "adminOverview",
  Users: "users",
  Feedback: "feedback",
  "App Settings": "appSettings",
  Profile: "profile",
  Requests: "requests",
  "My Activities": "activities",
  "Create Feedback": "createRequest",
  Comments: "comments",
  Votes: "votes",
  Settings: "settings",
};

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    ConfirmationDialogComponent,
    AvatarMenuComponent,
  ],
  template: `
    <button
      type="button"
      class="fixed start-4 top-4 z-50 inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      aria-label="Open navigation"
      (click)="openMobile()"
    >
      <lucide-icon name="menu" [size]="20" />
    </button>

    @if (mobileOpen()) {
      <button
        type="button"
        class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        aria-label="Close navigation overlay"
        (click)="closeMobile()"
      ></button>
    }

    <aside [class]="asideClass()">
      <div class="flex h-full min-h-0 flex-col">
        <div
          class="flex h-16 items-center gap-3 border-b border-slate-200 px-4"
        >
          <div
            class="grid size-9 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white"
          >
            FH
          </div>

          @if (!collapsed()) {
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-950">
                FeedbackHub
              </p>
              <p class="truncate text-xs text-slate-500">{{ roleLabel() }}</p>
            </div>
          }

          <button
            type="button"
            class="hidden size-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:inline-flex"
            [attr.aria-label]="
              collapsed() ? 'Expand sidebar' : 'Collapse sidebar'
            "
            [attr.title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            (click)="toggleCollapsed()"
          >
            <lucide-icon
              [name]="collapsed() ? 'panel-left-open' : 'panel-left-close'"
              [size]="19"
            />
          </button>

          <button
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:hidden"
            aria-label="Close navigation"
            (click)="closeMobile()"
          >
            <lucide-icon name="x" [size]="20" />
          </button>
        </div>

        <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div class="grid gap-1">
            @for (link of links(); track link.route) {
              <a
                [routerLink]="link.route"
                routerLinkActive
                #activeLink="routerLinkActive"
                [routerLinkActiveOptions]="
                  link.exact ? exactMatch : partialMatch
                "
                [class]="linkClass(activeLink.isActive)"
                [attr.title]="collapsed() ? link.title : null"
                (click)="closeMobile()"
              >
                <lucide-icon [name]="link.icon" [size]="20" class="shrink-0" />

                @if (!collapsed()) {
                  <span class="truncate">{{ linkTitle(link) }}</span>
                }
              </a>
            }
          </div>
        </nav>

        <div class="border-t border-slate-200 p-3">
          <app-avatar-menu (logout)="logout()" />
        </div>
      </div>
    </aside>
    <app-confirmation-dialog
      [open]="logoutOpen()"
      [title]="translator.translate('logoutTitle')"
      [message]="translator.translate('logoutMessage')"
      [confirmLabel]="translator.translate('logout')"
      [cancelLabel]="translator.translate('cancel')"
      (cancel)="logoutOpen.set(false)"
      (confirm)="confirmLogout()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  readonly translator = inject(TranslatorService);

  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly logoutOpen = signal(false);
  readonly accountMenuOpen = signal(false);
  readonly account = accountInfo;

  readonly links = computed<NavLink[]>(() =>
    linksForRole(this.account()?.role),
  );
  readonly roleLabel = computed(() =>
    this.account()?.role === "ADMIN"
      ? this.translator.translate("adminWorkspace")
      : this.translator.translate("userWorkspace"),
  );

  readonly exactMatch = { exact: true };
  readonly partialMatch = { exact: false };

  toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  linkTitle(link: NavLink): string {
    const key = navTranslationKeys[link.title];
    return key
      ? this.translator.translate(key)
      : this.translator.text(link.title);
  }

  logout(): void {
    this.accountMenuOpen.set(false);
    this.logoutOpen.set(true);
  }

  toggleAccountMenu(): void {
    this.accountMenuOpen.update((value) => !value);
  }

  avatarInitial(): string {
    return (this.account()?.name || this.account()?.email || "A")
      .charAt(0)
      .toUpperCase();
  }

  goToProfile(): void {
    this.accountMenuOpen.set(false);
    void this.router.navigateByUrl("/profile");
  }

  async confirmLogout(): Promise<void> {
    try {
      await this.authApi.logout();
    } finally {
      persistAccount(undefined);
      this.logoutOpen.set(false);
      void this.router.navigateByUrl("/login");
    }
  }

  asideClass(): string {
    return cn(
      "app-sidebar-panel fixed inset-y-0 start-0 z-50 border-e border-slate-200 bg-white transition-all duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen",
      this.collapsed() ? "lg:w-20" : "lg:w-72",
      this.mobileOpen() ? "is-open w-72 shadow-xl" : "w-72",
    );
  }

  linkClass(active: boolean): string {
    return cn(
      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
      this.collapsed() ? "lg:justify-center lg:px-0" : "",
      active
        ? "bg-slate-950 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    );
  }
}
