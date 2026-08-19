import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="grid gap-1.5">
      @if (label()) {
        <span class="text-sm font-medium">{{ label() }}</span>
      }

      <ng-content />

      @if (error()) {
        <span class="auth-field-error text-xs text-destructive">
          {{ error() }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label = input('');
  readonly error = input('');
}
