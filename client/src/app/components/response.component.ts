import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { response } from '../context/global';
import { CustomButtonComponent } from './custom-button.component';

@Component({
  selector: 'app-response',
  standalone: true,
  imports: [CustomButtonComponent],
  template: `
    @if (responseValue(); as current) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold capitalize">
            {{ current.type }}
          </h2>

          <p class="mt-2 text-sm text-muted-foreground">
            {{ current.message }}
          </p>

          <app-custom-button
            className="mt-4"
            (click)="close()"
          >
            OK
          </app-custom-button>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseComponent {
  readonly responseValue = response.asReadonly();

  close(): void {
    response.set(undefined);
  }
}
