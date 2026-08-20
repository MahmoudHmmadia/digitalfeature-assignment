import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
  ElementRef,
  viewChildren,
  inject,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { cn } from "../lib/utils";
import { TranslatorService } from "../lang/translator.service";

const CODE_LENGTH = 6;

@Component({
  selector: "app-otp-input",
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="grid gap-1.5">
      @if (label()) {
        <span class="text-sm font-medium">{{ t.text(label()) }}</span>
      }

      <div class="flex justify-center gap-2">
        @for (i of indices; track i) {
          <input
            #digitInput
            type="text"
            inputmode="numeric"
            maxlength="1"
            autocomplete="one-time-code"
            [class]="digitClasses()"
            [value]="digits()[i]"
            (input)="onDigitInput($event, i)"
            (keydown)="onKeyDown($event, i)"
            (paste)="onPaste($event)"
            (focus)="onFocus(i)"
          />
        }
      </div>

      @if (error()) {
        <span class="auth-field-error text-center text-xs text-destructive">
          {{ error() }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent implements ControlValueAccessor {
  readonly t = inject(TranslatorService);
  readonly label = input("");
  readonly error = input("");

  readonly indices = Array.from({ length: CODE_LENGTH }, (_, i) => i);
  readonly digits = signal<string[]>(Array(CODE_LENGTH).fill(""));
  readonly focusedIndex = signal(-1);

  readonly digitInputs =
    viewChildren<ElementRef<HTMLInputElement>>("digitInput");

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouchedFn: () => void = () => {};

  digitClasses(): string {
    return cn(
      "flex h-12 w-11 items-center justify-center rounded-md border bg-transparent text-center text-lg font-semibold shadow-xs outline-none transition-all",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      this.error()
        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
        : "",
    );
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const char = input.value.replace(/\D/g, "").slice(-1);
    input.value = char;

    const current = [...this.digits()];
    current[index] = char;
    this.digits.set(current);
    this.emitValue(current);

    if (char && index < CODE_LENGTH - 1) {
      this.focusAt(index + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === "Backspace") {
      const current = [...this.digits()];

      if (current[index]) {
        current[index] = "";
        this.digits.set(current);
        this.emitValue(current);
      } else if (index > 0) {
        current[index - 1] = "";
        this.digits.set(current);
        this.emitValue(current);
        this.focusAt(index - 1);
      }

      event.preventDefault();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      this.focusAt(index - 1);
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      this.focusAt(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData("text") ?? "";
    const cleaned = text.replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (!cleaned) return;

    const current = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < cleaned.length; i++) {
      current[i] = cleaned[i];
    }

    this.digits.set(current);
    this.emitValue(current);

    const focusIdx = Math.min(cleaned.length, CODE_LENGTH - 1);
    this.focusAt(focusIdx);
  }

  onFocus(index: number): void {
    this.focusedIndex.set(index);
    this.onTouchedFn();
  }

  private focusAt(index: number): void {
    const inputs = this.digitInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
      inputs[index].nativeElement.select();
    }
  }

  private emitValue(digits: string[]): void {
    this.onChangeFn(digits.join(""));
  }

  /* ── ControlValueAccessor ── */

  writeValue(val: string): void {
    const v = (val ?? "").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const arr = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < v.length; i++) {
      arr[i] = v[i];
    }
    this.digits.set(arr);
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }
}
