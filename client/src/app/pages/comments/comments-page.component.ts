import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { PageLayoutComponent } from "../../components/page-layout.component";
import { ButtonComponent } from "../../components/ui/button.component";
import { TextareaComponent } from "../../components/ui/textarea.component";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog.component";
import { CommentsService } from "./comments.service";
import type { FeedbackComment } from "../../types/feedback";
@Component({
  selector: "app-comments-page",
  standalone: true,
  imports: [
    DatePipe,
    PageLayoutComponent,
    ButtonComponent,
    TextareaComponent,
    ConfirmationDialogComponent,
  ],
  providers: [CommentsService],
  template: `<app-page-layout
      title="My comments"
      description="Review and manage your discussion activity."
    >
      @if (svc.editing(); as editing) {
        <section class="mb-4 rounded-lg border bg-white p-5">
          <p class="mb-2 text-sm font-medium">
            Editing comment on {{ editing.feedbackRequest?.title }}
          </p>
          <app-textarea [(value)]="svc.content" />
          <div class="mt-2 flex justify-end gap-2">
            <app-button variant="ghost" (click)="svc.cancel()"
              >Cancel</app-button
            ><app-button (click)="svc.save()">Save</app-button>
          </div>
        </section>
      }
      <div class="grid gap-3">
        @if (svc.loading()) {
          <p class="rounded-lg border bg-white p-8 text-center">Loading…</p>
        } @else if (!svc.comments().length) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            You have not posted any comments.
          </p>
        }
        @for (comment of svc.comments(); track comment.id) {
          <article class="rounded-lg border bg-white p-5">
            <div class="flex justify-between gap-3">
              <app-button
                variant="ghost"
                className="px-0 text-start font-semibold"
                (click)="
                  router.navigate(['/feedback', comment.feedbackRequestId])
                "
                >{{
                  comment.feedbackRequest?.title || "Feedback request"
                }}</app-button
              ><time class="text-xs text-slate-500">{{
                comment.createdAt | date: "mediumDate"
              }}</time>
            </div>
            <p class="mt-3 text-sm text-slate-700">{{ comment.content }}</p>
            <div class="mt-3 flex justify-end gap-2">
              <app-button variant="ghost" (click)="svc.start(comment)"
                >Edit</app-button
              ><app-button [danger]="true" (click)="selected.set(comment)"
                >Delete</app-button
              >
            </div>
          </article>
        }
      </div></app-page-layout
    ><app-confirmation-dialog
      [open]="!!selected()"
      title="Delete comment?"
      message="This comment will be permanently removed."
      confirmLabel="Delete"
      (cancel)="selected.set(null)"
      (confirm)="confirmDelete()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsPageComponent implements OnInit {
  readonly svc = inject(CommentsService);
  readonly router = inject(Router);
  readonly selected = signal<FeedbackComment | null>(null);
  ngOnInit(): void {
    void this.svc.load();
  }
  async confirmDelete(): Promise<void> {
    const item = this.selected();
    if (!item) return;
    await this.svc.remove(item);
    this.selected.set(null);
  }
}
