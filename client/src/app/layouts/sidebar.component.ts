import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { linksForRole, type NavLink } from '../constants/links';
import { accountInfo, persistAccount } from '../context/global';
import { cn } from '../lib/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <button
      type="button"
      class="fixed left-4 top-4 z-50 inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
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
        <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
          <div class="grid size-9 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
            FH
          </div>

          @if (!collapsed()) {
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-950">FeedbackHub</p>
              <p class="truncate text-xs text-slate-500">{{ roleLabel() }}</p>
            </div>
          }

          <button
            type="button"
            class="hidden size-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:inline-flex"
            [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            [attr.title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            (click)="toggleCollapsed()"
          >
            <lucide-icon [name]="collapsed() ? 'panel-left-open' : 'panel-left-close'" [size]="19" />
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
                [routerLinkActiveOptions]="link.exact ? exactMatch : partialMatch"
                [class]="linkClass(activeLink.isActive)"
                [attr.title]="collapsed() ? link.title : null"
                (click)="closeMobile()"
              >
                <lucide-icon [name]="link.icon" [size]="20" class="shrink-0" />

                @if (!collapsed()) {
                  <span class="truncate">{{ link.title }}</span>
                }
              </a>
            }
          </div>
        </nav>

        <div class="border-t border-slate-200 p-3">
          @if (!collapsed()) {
            <div class="mb-3 rounded-md bg-slate-50 px-3 py-2">
              <p class="truncate text-sm font-medium text-slate-900">
                {{ account()?.name || account()?.email || 'Account' }}
              </p>
              <p class="truncate text-xs text-slate-500">{{ account()?.email }}</p>
            </div>
          }

          <button
            type="button"
            [class]="logoutClass()"
            [attr.title]="collapsed() ? 'Logout' : null"
            (click)="logout()"
          >
            <lucide-icon name="log-out" [size]="19" />
            @if (!collapsed()) {
              <span>Logout</span>
            }
          </button>
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly account = accountInfo;

  readonly links = computed<NavLink[]>(() => linksForRole(this.account()?.role));
  readonly roleLabel = computed(() =>
    this.account()?.role === 'ADMIN' ? 'Admin workspace' : 'User workspace',
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

  logout(): void {
    persistAccount(undefined);
    void this.router.navigateByUrl('/login');
  }

  asideClass(): string {
    return cn(
      'fixed inset-y-0 left-0 z-50 border-r border-slate-200 bg-white transition-all duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen',
      this.collapsed() ? 'lg:w-20' : 'lg:w-72',
      this.mobileOpen() ? 'w-72 translate-x-0 shadow-xl' : 'w-72 -translate-x-full lg:translate-x-0',
    );
  }

  linkClass(active: boolean): string {
    return cn(
      'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
      this.collapsed() ? 'lg:justify-center lg:px-0' : '',
      active
        ? 'bg-slate-950 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    );
  }

  logoutClass(): string {
    return cn(
      'flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700',
      this.collapsed() ? 'lg:justify-center lg:px-0' : '',
    );
  }
}
