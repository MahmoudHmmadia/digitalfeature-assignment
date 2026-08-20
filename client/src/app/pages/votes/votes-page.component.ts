import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { PageLayoutComponent } from "../../components/page-layout.component";
import { ButtonComponent } from "../../components/ui/button.component";
import { VotesService } from "./votes.service";
@Component({
  selector: "app-votes-page",
  standalone: true,
  imports: [PageLayoutComponent, ButtonComponent],
  providers: [VotesService],
  template: `<app-page-layout
    title="My votes"
    description="Requests you have upvoted."
    ><div class="grid gap-3">
      @if (svc.loading()) {
        <p class="rounded-lg border bg-white p-8 text-center">Loading…</p>
      } @else if (!svc.votes().length) {
        <p
          class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
        >
          You have not voted for any requests.
        </p>
      }
      @for (vote of svc.votes(); track vote.id) {
        <article
          class="flex flex-col justify-between gap-4 rounded-lg border bg-white p-5 sm:flex-row sm:items-center"
        >
          <div>
            <h2 class="font-semibold">{{ vote.feedbackRequest.title }}</h2>
            <p class="mt-1 line-clamp-1 text-sm text-slate-500">
              {{ vote.feedbackRequest.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <app-button
              variant="outline"
              (click)="router.navigate(['/feedback', vote.feedbackRequestId])"
              >Open</app-button
            ><app-button [danger]="true" (click)="svc.remove(vote)"
              >Remove vote</app-button
            >
          </div>
        </article>
      }
    </div></app-page-layout
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotesPageComponent implements OnInit {
  readonly svc = inject(VotesService);
  readonly router = inject(Router);
  ngOnInit(): void {
    void this.svc.load();
  }
}
