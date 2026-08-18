import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  template: `
    <main class="min-h-screen w-full bg-slate-50 p-6">
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <h1 class="text-3xl font-bold capitalize text-main">
          {{ title() }}
        </h1>

        <ng-content />
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  readonly title = input.required<string>();
}
