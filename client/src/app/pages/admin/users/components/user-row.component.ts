import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import type { AdminAccount } from "../../../../api/admin.api";
import { ButtonComponent } from "../../../../components/ui/button.component";
import { TranslatorService } from "../../../../lang/translator.service";

@Component({
  selector: "app-admin-user-row",
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  template: `
    <article
      class="grid gap-4 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 font-semibold text-slate-700"
        >
          @if (user().avatarUrl) {
            <img
              [src]="user().avatarUrl"
              alt=""
              class="size-full object-cover"
            />
          } @else {
            {{ (user().name || "?").charAt(0).toUpperCase() }}
          }
        </div>
        <div class="min-w-0">
          <p class="truncate font-medium text-slate-950">
            {{ user().name || t.text("Unnamed user") }}
          </p>
          <p class="truncate text-xs text-slate-500">
            {{ user().slug || user().id }}
          </p>
        </div>
      </div>
      <div class="text-sm text-slate-500">
        {{ user().createdAt | date: "mediumDate" }}
      </div>
      <div class="flex gap-2">
        <app-button
          variant="outline"
          [disabled]="user().isDeleted"
          [className]="
            user().isSuspended
              ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              : 'border-amber-200 text-amber-700 hover:bg-amber-50'
          "
          (click)="toggle.emit(user())"
          >{{
            t.text(user().isSuspended ? "Unsuspend" : "Suspend")
          }}</app-button
        ><app-button
          [danger]="!user().isDeleted"
          variant="outline"
          (click)="deleted.emit(user())"
          >{{ t.text(user().isDeleted ? "Restore" : "Delete") }}</app-button
        >
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRowComponent {
  readonly t = inject(TranslatorService);
  readonly user = input.required<AdminAccount>();
  readonly toggle = output<AdminAccount>();
  readonly deleted = output<AdminAccount>();
}
