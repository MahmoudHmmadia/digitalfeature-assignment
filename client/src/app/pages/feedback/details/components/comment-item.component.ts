import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { ButtonComponent } from "../../../../components/ui/button.component";
import { TranslatorService } from "../../../../lang/translator.service";
import type { FeedbackComment } from "../../../../types/feedback";
@Component({
  selector: "app-comment-item",
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  template: `<article class="border-b border-slate-100 py-4 last:border-0">
    <div class="flex justify-between gap-3">
      <div>
        <p class="text-sm font-medium">
          {{ comment().author?.name || t.text("Unknown user") }}
        </p>
        <time class="text-xs text-slate-500">{{
          comment().createdAt | date: "medium"
        }}</time>
      </div>
      @if (owned()) {
        <div class="flex gap-1">
          <app-button variant="ghost" (click)="edit.emit(comment())">{{
            t.text("Edit")
          }}</app-button
          ><app-button
            variant="ghost"
            className="text-red-700"
            (click)="remove.emit(comment())"
            >{{ t.text("Delete") }}</app-button
          >
        </div>
      }
    </div>
    <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
      {{ comment().content }}
    </p>
  </article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent {
  readonly t = inject(TranslatorService);
  readonly comment = input.required<FeedbackComment>();
  readonly owned = input(false);
  readonly edit = output<FeedbackComment>();
  readonly remove = output<FeedbackComment>();
}
