import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog.component";
import { PageLayoutComponent } from "../../components/page-layout.component";
import { ButtonComponent } from "../../components/ui/button.component";
import { TextareaComponent } from "../../components/ui/textarea.component";
import { TranslatorService } from "../../lang/translator.service";
import type { FeedbackComment } from "../../types/feedback";
import { CommentsService } from "../comments/comments.service";
import { VotesService } from "../votes/votes.service";
import { ActivityCardComponent } from "./components/activity-card.component";
@Component({
  selector: "app-activities-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    ActivityCardComponent,
    ButtonComponent,
    TextareaComponent,
    ConfirmationDialogComponent,
  ],
  providers: [CommentsService, VotesService],
  template: `<app-page-layout
      title="My activities"
      description="Comments you posted and requests you voted for."
      ><div
        class="mb-5 flex w-fit rounded-lg border border-slate-200 bg-white p-1"
      >
        <button
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
          [class.bg-slate-950]="tab() === 'comments'"
          [class.text-white]="tab() === 'comments'"
          [class.text-slate-600]="tab() !== 'comments'"
          (click)="switchTab('comments')"
        >
          {{ t.text("My comments") }}</button
        ><button
          type="button"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
          [class.bg-slate-950]="tab() === 'votes'"
          [class.text-white]="tab() === 'votes'"
          [class.text-slate-600]="tab() !== 'votes'"
          (click)="switchTab('votes')"
        >
          {{ t.text("My votes") }}
        </button>
      </div>
      @if (comments.editing(); as editing) {
        <section class="mb-5 rounded-xl border bg-white p-5">
          <p class="mb-2 text-sm font-medium">
            {{ t.text("Editing comment on") }}
            {{ editing.feedbackRequest?.title }}
          </p>
          <app-textarea [(value)]="comments.content" />
          <div class="mt-3 flex justify-end gap-2">
            <app-button variant="ghost" (click)="comments.cancel()">{{
              t.text("Cancel")
            }}</app-button
            ><app-button
              [disabled]="!comments.content().trim()"
              (click)="comments.save()"
              >{{ t.text("Save") }}</app-button
            >
          </div>
        </section>
      }
      <div class="grid gap-3">
        @if (loading()) {
          <p
            class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
          >
            {{ t.text("Loading activities…") }}
          </p>
        } @else if (tab() === "comments") {
          @if (!comments.comments().length) {
            <p
              class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
            >
              {{ t.text("You have not posted any comments.") }}
            </p>
          }
          @for (comment of comments.comments(); track comment.id) {
            <app-activity-card
              kind="comment"
              [title]="
                comment.feedbackRequest?.title || t.text('Feedback request')
              "
              [content]="comment.content"
              [createdAt]="comment.createdAt"
              (open)="open(comment.feedbackRequestId)"
              (edit)="comments.start(comment)"
              (remove)="selectedComment.set(comment)"
            />
          }
        } @else {
          @if (!votes.votes().length) {
            <p
              class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
            >
              {{ t.text("You have not voted for any requests.") }}
            </p>
          }
          @for (vote of votes.votes(); track vote.id) {
            <app-activity-card
              kind="vote"
              [title]="vote.feedbackRequest.title"
              [description]="vote.feedbackRequest.description"
              [createdAt]="vote.createdAt"
              (open)="open(vote.feedbackRequestId)"
              (remove)="votes.remove(vote)"
            />
          }
        }</div></app-page-layout
    ><app-confirmation-dialog
      [open]="!!selectedComment()"
      title="Delete comment?"
      message="This comment will be permanently removed."
      confirmLabel="Delete"
      (cancel)="selectedComment.set(null)"
      (confirm)="confirmDelete()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesPageComponent implements OnInit {
  readonly comments = inject(CommentsService);
  readonly votes = inject(VotesService);
  readonly router = inject(Router);
  readonly t = inject(TranslatorService);
  readonly tab = signal<"comments" | "votes">("comments");
  readonly selectedComment = signal<FeedbackComment | null>(null);
  readonly loading = () =>
    this.tab() === "comments" ? this.comments.loading() : this.votes.loading();
  ngOnInit(): void {
    void this.comments.load();
  }
  switchTab(tab: "comments" | "votes"): void {
    if (tab === this.tab()) return;
    this.tab.set(tab);
    this.comments.cancel();
    if (tab === "comments") void this.comments.load();
    else void this.votes.load();
  }
  open(id: string): void {
    void this.router.navigate(["/feedback", id]);
  }
  async confirmDelete(): Promise<void> {
    const comment = this.selectedComment();
    if (!comment) return;
    await this.comments.remove(comment);
    this.selectedComment.set(null);
  }
}
