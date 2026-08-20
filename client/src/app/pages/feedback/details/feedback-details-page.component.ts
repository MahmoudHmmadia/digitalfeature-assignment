import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog.component";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TextareaComponent } from "../../../components/ui/textarea.component";
import { accountInfo } from "../../../context/global";
import { TranslatorService } from "../../../lang/translator.service";
import type { FeedbackComment } from "../../../types/feedback";
import { CommentItemComponent } from "./components/comment-item.component";
import { FeedbackDetailsService } from "./feedback-details.service";
const statusLabels = [
  "New",
  "Under review",
  "Planned",
  "In progress",
  "Done",
  "Declined",
];
@Component({
  selector: "app-feedback-details-page",
  standalone: true,
  imports: [
    DatePipe,
    PageLayoutComponent,
    ButtonComponent,
    TextareaComponent,
    ConfirmationDialogComponent,
    CommentItemComponent,
  ],
  providers: [FeedbackDetailsService],
  template: `<app-page-layout title="Feedback details" backRoute="/">
      @if (svc.loading()) {
        <p class="rounded-lg border bg-white p-8 text-center">
          {{ t.text("Loading…") }}
        </p>
      } @else if (svc.item(); as item) {
        <article class="rounded-lg border bg-white p-6">
          <div class="flex flex-wrap justify-between gap-3">
            <div>
              <div class="flex flex-wrap gap-2">
                @if (item.pinned) {
                  <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs">{{
                    t.text("Pinned")
                  }}</span>
                }
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                  >{{ t.text("Status") }}
                  {{ t.text(statusLabel(item.status)) }}</span
                ><span class="text-xs text-slate-500">{{
                  item.category.name
                }}</span>
              </div>
              <h1 class="mt-3 text-2xl font-semibold">{{ item.title }}</h1>
              <p class="mt-1 text-xs text-slate-500">
                {{ t.text("By") }}
                {{ item.author?.name || t.text("Unknown") }} ·
                {{ item.createdAt | date: "medium" }}
              </p>
            </div>
            @if (item.authorId === account()?.id) {
              <app-button
                variant="outline"
                (click)="router.navigate(['/feedback', item.id, 'edit'])"
                >{{ t.text("Edit") }}</app-button
              >
            }
          </div>
          <p class="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {{ item.description }}
          </p>
          <div class="mt-6 border-t pt-4">
            <app-button
              [variant]="item.hasVoted ? 'primary' : 'outline'"
              (click)="svc.vote()"
              >▲ {{ item.voteCount }} {{ t.text("votes") }}</app-button
            >
          </div>
        </article>
        <section class="mt-5 rounded-lg border bg-white p-6">
          <h2 class="text-lg font-semibold">
            {{ t.text("Discussion") }} ({{ item.commentCount }})
          </h2>
          <div class="mt-4">
            <app-textarea
              [placeholder]="
                svc.editingId() ? 'Edit comment' : 'Add to the discussion'
              "
              [(value)]="svc.content"
            />
            <div class="mt-2 flex justify-end gap-2">
              @if (svc.editingId()) {
                <app-button variant="ghost" (click)="svc.cancelEdit()">{{
                  t.text("Cancel edit")
                }}</app-button>
              }
              <app-button
                [loading]="svc.commentLoading()"
                [disabled]="!svc.content().trim()"
                (click)="svc.saveComment()"
                >{{
                  t.text(svc.editingId() ? "Save comment" : "Post comment")
                }}</app-button
              >
            </div>
          </div>
          <div class="mt-5">
            @if (!svc.comments().length) {
              <p class="py-6 text-center text-sm text-slate-500">
                {{ t.text("No comments yet.") }}
              </p>
            }
            @for (comment of svc.comments(); track comment.id) {
              <app-comment-item
                [comment]="comment"
                [owned]="comment.authorId === account()?.id"
                (edit)="svc.startEdit($event)"
                (remove)="selectedComment.set($event)"
              />
            }
          </div>
        </section>
      }</app-page-layout
    ><app-confirmation-dialog
      [open]="!!selectedComment()"
      title="Delete comment?"
      message="This comment will be permanently removed."
      confirmLabel="Delete"
      (cancel)="selectedComment.set(null)"
      (confirm)="confirmCommentDelete()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackDetailsPageComponent implements OnInit {
  readonly svc = inject(FeedbackDetailsService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly t = inject(TranslatorService);
  readonly account = accountInfo;
  readonly selectedComment = signal<FeedbackComment | null>(null);
  statusLabel(status: number): string {
    return statusLabels[status] ?? "Unknown";
  }
  ngOnInit(): void {
    void this.svc.load(this.route.snapshot.paramMap.get("id")!);
  }
  async confirmCommentDelete(): Promise<void> {
    const comment = this.selectedComment();
    if (!comment) return;
    await this.svc.deleteComment(comment);
    this.selectedComment.set(null);
  }
}
