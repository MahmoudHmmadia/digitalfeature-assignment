import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";
import { AdminOverviewService } from "./overview.service";

@Component({
  selector: "app-admin-overview-page",
  standalone: true,
  imports: [PageLayoutComponent, ButtonComponent],
  providers: [AdminOverviewService],
  template: `
    <app-page-layout
      [title]="t.text('Admin overview')"
      [description]="
        t.text('Monitor accounts, feedback, and community activity.')
      "
    >
      @if (svc.loading()) {
        <p
          class="rounded-lg border bg-white p-8 text-center text-sm text-slate-500"
        >
          {{ t.text("Loading analytics…") }}
        </p>
      } @else if (svc.error()) {
        <div class="rounded-lg border bg-white p-8 text-center">
          <p class="text-sm text-red-600">
            {{ t.text("Could not load analytics.") }}
          </p>
          <app-button variant="ghost" className="mt-3" (click)="svc.load()">{{
            t.text("Try again")
          }}</app-button>
        </div>
      } @else if (svc.analytics(); as analytics) {
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          @for (card of cards(analytics); track card.label) {
            <section class="rounded-lg border bg-white p-5 shadow-sm">
              <p class="text-sm text-slate-500">{{ t.text(card.label) }}</p>
              <p class="mt-2 text-3xl font-semibold text-slate-950">
                {{ card.value }}
              </p>
            </section>
          }
        </div>
        <div class="mt-5 grid gap-4 lg:grid-cols-2">
          <section class="rounded-lg border bg-white p-5">
            <h2 class="font-semibold">{{ t.text("Account health") }}</h2>
            <div class="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-2xl font-semibold">
                  {{ analytics.users.active }}
                </p>
                <p class="text-xs text-slate-500">{{ t.text("Active") }}</p>
              </div>
              <div>
                <p class="text-2xl font-semibold">
                  {{ analytics.users.suspended }}
                </p>
                <p class="text-xs text-slate-500">{{ t.text("Suspended") }}</p>
              </div>
              <div>
                <p class="text-2xl font-semibold">
                  {{ analytics.users.deleted }}
                </p>
                <p class="text-xs text-slate-500">{{ t.text("Deleted") }}</p>
              </div>
            </div>
          </section>
          <section class="rounded-lg border bg-white p-5">
            <h2 class="font-semibold">{{ t.text("Requests by status") }}</h2>
            <div class="mt-4 grid gap-2">
              @for (item of analytics.feedbackByStatus; track item.status) {
                <div class="flex items-center justify-between text-sm">
                  <span>{{ t.text(statusLabel(item.status)) }}</span
                  ><span class="font-semibold">{{ item.count }}</span>
                </div>
              } @empty {
                <p class="text-sm text-slate-500">
                  {{ t.text("No feedback found.") }}
                </p>
              }
            </div>
          </section>
        </div>
      }
    </app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOverviewPageComponent implements OnInit {
  readonly svc = inject(AdminOverviewService);
  readonly t = inject(TranslatorService);
  ngOnInit(): void {
    void this.svc.load();
  }
  cards(
    value: NonNullable<ReturnType<AdminOverviewService["analytics"]>>,
  ): Array<{ label: string; value: number }> {
    return [
      { label: "Users", value: value.users.total },
      { label: "Feedback", value: value.feedback },
      { label: "Comments", value: value.comments },
      { label: "Votes", value: value.votes },
      { label: "categories", value: value.categories },
    ];
  }
  statusLabel(status: number): string {
    return (
      ["New", "Under review", "Planned", "In progress", "Done", "Declined"][
        status
      ] ?? "Unknown status"
    );
  }
}
