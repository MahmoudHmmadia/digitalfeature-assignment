import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  signal,
  inject,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { InputComponent } from "./ui/input.component";
import { TranslatorService } from "../lang/translator.service";

@Component({
  selector: "app-custom-input",
  standalone: true,
  imports: [InputComponent, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="grid gap-1.5">
      <span class="text-sm font-medium">{{ t.text(label()) }}</span>

      <app-input
        [type]="type()"
        [placeholder]="placeholder()"
        [className]="
          error()
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30'
            : ''
        "
        [(value)]="innerValue"
        (valueChange)="onInnerChange($event)"
      />

      @if (error()) {
        <span class="auth-field-error text-xs text-destructive">
          {{ error() }}
        </span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements ControlValueAccessor {
  readonly t = inject(TranslatorService);
  readonly label = input.required<string>();
  readonly type = input("text");
  readonly placeholder = input("");
  readonly error = input("");

  /** Two-way binding for template-driven forms */
  readonly value = model("");

  /** Internal value used by both modes */
  readonly innerValue = signal("");

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  onInnerChange(val: string): void {
    this.value.set(val);
    this.onChange(val);
  }

  /* ── ControlValueAccessor ── */

  writeValue(val: string): void {
    const v = val ?? "";
    this.innerValue.set(v);
    this.value.set(v);
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
