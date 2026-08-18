import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { InputComponent } from './ui/input.component';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [InputComponent],
  template: `
    <label class="grid gap-2">
      <span class="text-sm font-medium">{{ label() }}</span>

      <app-input
        [type]="type()"
        [placeholder]="placeholder()"
        [className]="error() ? 'border-destructive' : ''"
        [(value)]="value"
      />

      @if (error()) {
        <span class="text-xs text-destructive">{{ error() }}</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent {
  readonly label = input.required<string>();
  readonly type = input('text');
  readonly placeholder = input('');
  readonly error = input('');
  readonly value = model('');
}
