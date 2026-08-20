import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog.component";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";
import type { FeedbackRequest } from "../../../types/feedback";
import { FeedbackCardComponent } from "../components/feedback-card.component";
import { FeedbackFilterComponent } from "../components/feedback-filter.component";
import { FeedbackListService } from "./feedback-list.service";
@Component({
  selector: "app-feedback-list-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    ButtonComponent,
    ConfirmationDialogComponent,
    FeedbackFilterComponent,
    FeedbackCardComponent,
  ],
  providers: [FeedbackListService],
  template: `<app-page-layout
      title="Requests"
      description="Browse and manage product feedback in one place."
      ><app-button
        page-actions
        (click)="router.navigateByUrl('/feedback/new')"
        >{{ t.text("Create feedback") }}</app-button
      >
      <div
        class="mb-5 flex w-fit rounded-lg border border-slate-200 bg-white p-1"
      >
        <button
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
          [class.bg-slate-950]="!mineTab()"
          [class.text-white]="!mineTab()"
          [class.text-slate-600]="mineTab()"
          (click)="switchTab(false)"
        >
          {{ t.text("Requests") }}</button
        ><button
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
          [class.bg-slate-950]="mineTab()"
          [class.text-white]="mineTab()"
          [class.text-slate-600]="!mineTab()"
          (click)="switchTab(true)"
        >
          {{ t.text("My requests") }}
        </button>
      </div>
      <app-feedback-filter
        [categories]="svc.categories()"
        (apply)="svc.apply($event)"
      />
      <div class="grid gap-4">
        @if (svc.loading()) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            {{ t.text("Loading feedback…") }}
          </p>
        } @else if (svc.error()) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-red-600"
          >
            {{ t.text("Could not load feedback.") }}
          </p>
        } @else if (!svc.items().length) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            {{ t.text("No feedback found.") }}
          </p>
        } @else {
          @for (item of svc.items(); track item.id) {
            <app-feedback-card
              [item]="item"
              [editable]="mineTab()"
              (open)="open($event)"
              (edit)="edit($event)"
              (vote)="svc.vote($event)"
              (remove)="selected.set($event)"
            />
          }
        }
      </div>
      <div class="mt-5 flex items-center justify-between text-sm">
        <span>{{ svc.total() }} {{ t.text("requests") }}</span>
        <div class="flex items-center gap-2">
          <app-button
            variant="outline"
            [disabled]="svc.page() === 1"
            (click)="svc.goTo(svc.page() - 1)"
            >{{ t.text("Previous") }}</app-button
          ><span>{{ svc.page() }} / {{ svc.pages() }}</span
          ><app-button
            variant="outline"
            [disabled]="svc.page() === svc.pages()"
            (click)="svc.goTo(svc.page() + 1)"
            >{{ t.text("Next") }}</app-button
          >
        </div>
      </div></app-page-layout
    ><app-confirmation-dialog
      [open]="!!selected()"
      title="Delete feedback?"
      message="This permanently deletes the request, comments, and votes."
      confirmLabel="Delete"
      (cancel)="selected.set(null)"
      (confirm)="confirmDelete()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackListPageComponent implements OnInit {
  readonly svc = inject(FeedbackListService);
  readonly router = inject(Router);
  readonly t = inject(TranslatorService);
  readonly mineTab = signal(false);
  readonly selected = signal<FeedbackRequest | null>(null);
  ngOnInit(): void {
    void this.svc.init(false);
  }
  switchTab(mine: boolean): void {
    if (mine === this.mineTab()) return;
    this.mineTab.set(mine);
    void this.svc.init(mine);
  }
  open(item: FeedbackRequest): void {
    void this.router.navigate(["/feedback", item.id]);
  }
  edit(item: FeedbackRequest): void {
    void this.router.navigate(["/feedback", item.id, "edit"]);
  }
  async confirmDelete(): Promise<void> {
    const item = this.selected();
    if (!item) return;
    await this.svc.remove(item);
    this.selected.set(null);
  }
}
