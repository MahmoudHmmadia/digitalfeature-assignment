import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";
import type { FeedbackRequest } from "../../../types/feedback";
const statusLabels = [
  "New",
  "Under review",
  "Planned",
  "In progress",
  "Done",
  "Declined",
];
@Component({
  selector: "app-feedback-card",
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  template: `<article class="rounded-lg border bg-white p-5 shadow-sm">
    <div class="flex flex-wrap justify-between gap-3">
      <div>
        <div class="flex flex-wrap gap-2">
          @if (item().pinned) {
            <span
              class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
              >{{ t.text("Pinned") }}</span
            >
          }
          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{{
            t.text(statusLabel())
          }}</span
          ><span class="text-xs text-slate-500">{{
            item().category.name
          }}</span>
        </div>
        <h2 class="mt-2 text-lg font-semibold">{{ item().title }}</h2>
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
      <span class="text-xs text-slate-500"
        >{{ item().author?.name || t.text("Unknown") }} ·
        {{ item().commentCount }} {{ t.text("comments") }}</span
      >
      <div class="flex gap-2">
        <app-button
          [variant]="item().hasVoted ? 'primary' : 'outline'"
          (click)="vote.emit(item())"
          >▲ {{ item().voteCount }}</app-button
        ><app-button variant="outline" (click)="open.emit(item())">{{
          t.text("Open")
        }}</app-button>
        @if (editable()) {
          <app-button variant="ghost" (click)="edit.emit(item())">{{
            t.text("Edit")
          }}</app-button
          ><app-button [danger]="true" (click)="remove.emit(item())">{{
            t.text("Delete")
          }}</app-button>
        }
      </div>
    </div>
  </article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackCardComponent {
  readonly t = inject(TranslatorService);
  readonly item = input.required<FeedbackRequest>();
  readonly editable = input(false);
  readonly open = output<FeedbackRequest>();
  readonly vote = output<FeedbackRequest>();
  readonly edit = output<FeedbackRequest>();
  readonly remove = output<FeedbackRequest>();
  statusLabel(): string {
    return statusLabels[this.item().status] ?? "Unknown status";
  }
}
