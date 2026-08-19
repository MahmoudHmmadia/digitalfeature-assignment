import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  template: `
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <header class="flex flex-col gap-2 border-b border-slate-200 pb-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          FeedbackHub
        </p>

        <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div class="min-w-0">
            <h1 class="text-2xl font-semibold text-slate-950 sm:text-3xl">
              {{ title() }}
            </h1>

            @if (description()) {
              <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {{ description() }}
              </p>
            }
          </div>

          <ng-content select="[page-actions]" />
        </div>
      </header>

      <div class="min-w-0">
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
