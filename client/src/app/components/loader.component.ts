import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex min-h-screen items-center justify-center">
      <span class="size-6 animate-spin rounded-full border-2 border-main border-t-transparent"></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
