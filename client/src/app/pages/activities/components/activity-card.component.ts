import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { LucideAngularModule } from "lucide-angular";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";
@Component({
  selector: "app-activity-card",
  standalone: true,
  imports: [DatePipe, ButtonComponent, LucideAngularModule],
  template: `<article
    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
  >
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div class="min-w-0">
        <div
          class="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          <lucide-icon
            [name]="kind() === 'comment' ? 'message-circle' : 'thumbs-up'"
            [size]="15"
          /><span>{{
            t.text(kind() === "comment" ? "Commented on" : "Voted for")
          }}</span
          ><span>·</span><time>{{ createdAt() | date: "mediumDate" }}</time>
        </div>
        <h2 class="truncate text-base font-semibold text-slate-950">
          {{ title() }}
        </h2>
        @if (content()) {
          <p
            class="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"
          >
            {{ content() }}
          </p>
        } @else if (description()) {
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {{ description() }}
          </p>
        }
      </div>
      <div class="flex shrink-0 flex-wrap gap-2">
        <app-button variant="outline" (click)="open.emit()">{{
          t.text("Open feedback")
        }}</app-button>
        @if (kind() === "comment") {
          <app-button variant="ghost" (click)="edit.emit()">{{
            t.text("Edit")
          }}</app-button
          ><app-button [danger]="true" (click)="remove.emit()">{{
            t.text("Delete")
          }}</app-button>
        } @else {
          <app-button [danger]="true" (click)="remove.emit()">{{
            t.text("Remove vote")
          }}</app-button>
        }
      </div>
    </div>
  </article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCardComponent {
  readonly t = inject(TranslatorService);
  readonly kind = input.required<"comment" | "vote">();
  readonly title = input.required<string>();
  readonly description = input("");
  readonly content = input("");
  readonly createdAt = input.required<string>();
  readonly open = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
