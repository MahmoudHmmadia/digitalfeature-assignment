import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog.component";
import { FeedbackCardComponent } from "./components/feedback-card.component";
import { AdminFeedbacksService } from "./feedbacks.service";
import type { AdminFeedback } from "../../../api/admin.api";
import {
  FilterComponent,
  type FilterResult,
} from "../../../components/ui/filter.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";

@Component({
  selector: "app-admin-feedbacks-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    ConfirmationDialogComponent,
    FeedbackCardComponent,
    FilterComponent,
    ButtonComponent,
  ],
  providers: [AdminFeedbacksService],
  template: `
    <app-page-layout
      [title]="t.text('Feedback')"
      [description]="t.text('Review, pin, and remove product feedback.')"
    >
      <app-filter
        [searchPlaceholder]="t.text('Search feedback')"
        [selectLabel]="t.text('Pinned state')"
        [options]="filterOptions"
        (apply)="filter($event)"
      />
      <div class="grid gap-4">
        @if (svc.loading()) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            {{ t.text("Loading feedback…") }}
          </p>
        } @else if (svc.error()) {
          <div class="rounded-lg border bg-white p-8 text-center">
            <p class="text-sm text-red-600">
              {{ t.text("Could not load feedback.") }}
            </p>
            <app-button variant="ghost" className="mt-3" (click)="svc.load()">{{
              t.text("Try again")
            }}</app-button>
          </div>
        } @else if (!svc.items().length) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            {{ t.text("No feedback matches these filters.") }}
          </p>
        } @else {
          @for (item of svc.items(); track item.id) {
            <app-admin-feedback-card
              [item]="item"
              (pin)="svc.pin($event)"
              (remove)="selected.set($event)"
            />
          }
        }
      </div>
      <div
        class="mt-4 flex items-center justify-between text-sm text-slate-600"
      >
        <span>{{ svc.total() }} {{ t.text("items") }}</span>
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
      title="Delete feedback?"
      message="This permanently removes the feedback and its related discussion and votes."
      confirmLabel="Delete"
      [loading]="svc.mutatingId() !== null"
      (cancel)="selected.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFeedbacksPageComponent implements OnInit {
  readonly svc = inject(AdminFeedbacksService);
  readonly t = inject(TranslatorService);
  readonly selected = signal<AdminFeedback | null>(null);
  readonly filterOptions = [
    { value: "all", label: "All feedback" },
    { value: "pinned", label: "Pinned" },
    { value: "regular", label: "Not pinned" },
  ] as const;
  ngOnInit(): void {
    void this.svc.load();
  }
  filter(result: FilterResult): void {
    void this.svc.applyFilters(
      result.search,
      result.value as "all" | "pinned" | "regular",
    );
  }
  async confirmDelete(): Promise<void> {
    const item = this.selected();
    if (!item) return;
    await this.svc.remove(item);
    this.selected.set(null);
  }
}
