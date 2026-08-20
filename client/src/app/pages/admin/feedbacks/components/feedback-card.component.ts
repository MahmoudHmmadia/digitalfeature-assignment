import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import type { AdminFeedback } from "../../../../api/admin.api";
import { ButtonComponent } from "../../../../components/ui/button.component";
import { TranslatorService } from "../../../../lang/translator.service";

@Component({
  selector: "app-admin-feedback-card",
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  template: `
    <article class="rounded-lg border bg-white p-5 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            @if (item().pinned) {
              <span
                class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                >{{ t.text("Pinned") }}</span
              >
            }
            <span
              class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >{{ t.text("Status") }} {{ item().status }}</span
            >
            @if (item().category) {
              <span class="text-xs text-slate-500">{{
                item().category?.name
              }}</span>
            }
          </div>
          <h2 class="mt-2 text-lg font-semibold text-slate-950">
            {{ item().title }}
          </h2>
        </div>
        <time class="text-xs text-slate-500">{{
          item().createdAt | date: "mediumDate"
        }}</time>
      </div>
      <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {{ item().description }}
      </p>
      <div
        class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
      >
        <p class="text-xs text-slate-500">
          {{ t.text("By") }} {{ item().author?.name || t.text("Unknown") }} ·
          {{ item().voteCount || 0 }} {{ t.text("votes") }} ·
          {{ item().commentCount || 0 }} {{ t.text("comments") }}
        </p>
        <div class="flex gap-2">
          <app-button variant="outline" (click)="pin.emit(item())">{{
            t.text(item().pinned ? "Unpin" : "Pin")
          }}</app-button
          ><app-button [danger]="true" (click)="remove.emit(item())">{{
            t.text("Delete")
          }}</app-button>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackCardComponent {
  readonly t = inject(TranslatorService);
  readonly item = input.required<AdminFeedback>();
  readonly pin = output<AdminFeedback>();
  readonly remove = output<AdminFeedback>();
}
