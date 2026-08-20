import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog.component";
import { UserRowComponent } from "./components/user-row.component";
import { AdminUsersService } from "./users.service";
import type { AdminAccount } from "../../../api/admin.api";
import {
  FilterComponent,
  type FilterResult,
} from "../../../components/ui/filter.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";

@Component({
  selector: "app-admin-users-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    ConfirmationDialogComponent,
    UserRowComponent,
    FilterComponent,
    ButtonComponent,
  ],
  providers: [AdminUsersService],
  template: `
    <app-page-layout
      [title]="t.text('Users')"
      [description]="
        t.text('Search accounts and control access to FeedbackHub.')
      "
    >
      <app-filter
        [searchPlaceholder]="t.text('Search by name')"
        [selectLabel]="t.text('Account state')"
        [options]="filterOptions"
        (apply)="filter($event)"
      />
      <section class="overflow-hidden rounded-lg border bg-white">
        @if (svc.loading()) {
          <p class="p-8 text-center text-sm text-slate-500">
            {{ t.text("Loading users…") }}
          </p>
        } @else if (svc.error()) {
          <div class="p-8 text-center">
            <p class="text-sm text-red-600">
              {{ t.text("Could not load users.") }}
            </p>
            <app-button variant="ghost" className="mt-3" (click)="svc.load()">{{
              t.text("Try again")
            }}</app-button>
          </div>
        } @else if (!svc.users().length) {
          <p class="p-8 text-center text-sm text-slate-500">
            {{ t.text("No users match these filters.") }}
          </p>
        } @else {
          @for (user of svc.users(); track user.id) {
            <app-admin-user-row
              [user]="user"
              (toggle)="selected.set($event)"
              (deleted)="deleteSelected.set($event)"
            />
          }
        }
      </section>
      <div
        class="mt-4 flex items-center justify-between text-sm text-slate-600"
      >
        <span>{{ svc.total() }} {{ t.text("users") }}</span>
        <div class="flex items-center gap-2">
          <app-button
            variant="outline"
            [disabled]="svc.page() === 1"
            (click)="svc.goTo(svc.page() - 1)"
            >{{ t.text("Previous") }}</app-button
          ><span class="px-2">{{ svc.page() }} / {{ svc.pages() }}</span
          ><app-button
            variant="outline"
            [disabled]="svc.page() === svc.pages()"
            (click)="svc.goTo(svc.page() + 1)"
            >{{ t.text("Next") }}</app-button
          >
        </div>
      </div>
    </app-page-layout>
    <app-confirmation-dialog
      [open]="!!selected()"
      [title]="
        t.text(
          selected()?.isSuspended ? 'Unsuspend account?' : 'Suspend account?'
        )
      "
      [message]="
        t.text(
          selected()?.isSuspended
            ? 'This user will be able to sign in again.'
            : 'This user will lose access until an admin restores it.'
        )
      "
      [confirmLabel]="t.text(selected()?.isSuspended ? 'Unsuspend' : 'Suspend')"
      [cancelLabel]="t.text('Cancel')"
      [loading]="svc.mutatingId() !== null"
      (cancel)="selected.set(null)"
      (confirm)="confirmToggle()"
    />
    <app-confirmation-dialog
      [open]="!!deleteSelected()"
      [title]="
        t.text(
          deleteSelected()?.isDeleted ? 'Restore account?' : 'Delete account?'
        )
      "
      [message]="
        t.text(
          deleteSelected()?.isDeleted
            ? 'This user will be able to sign in again.'
            : 'This user will lose access until an admin restores it.'
        )
      "
      [confirmLabel]="
        t.text(deleteSelected()?.isDeleted ? 'Restore' : 'Delete')
      "
      [cancelLabel]="t.text('Cancel')"
      [loading]="svc.mutatingId() !== null"
      (cancel)="deleteSelected.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPageComponent implements OnInit {
  readonly svc = inject(AdminUsersService);
  readonly t = inject(TranslatorService);
  readonly selected = signal<AdminAccount | null>(null);
  readonly deleteSelected = signal<AdminAccount | null>(null);
  readonly filterOptions = [
    { value: "all", label: "All accounts" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "deleted", label: "Deleted" },
  ] as const;
  ngOnInit(): void {
    void this.svc.load();
  }
  filter(result: FilterResult): void {
    void this.svc.applyFilters(
      result.search,
      result.value as "all" | "active" | "suspended" | "deleted",
    );
  }
  async confirmToggle(): Promise<void> {
    const user = this.selected();
    if (!user) return;
    await this.svc.toggle(user);
    this.selected.set(null);
  }
  async confirmDelete(): Promise<void> {
    const user = this.deleteSelected();
    if (!user) return;
    await this.svc.setDeleted(user);
    this.deleteSelected.set(null);
  }
}
