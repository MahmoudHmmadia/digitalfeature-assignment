import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
  inject,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { cn } from "../lib/utils";
import { TranslatorService } from "../lang/translator.service";

@Component({
  selector: "app-password-input",
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="grid gap-1.5">
      <span class="text-sm font-medium">{{ t.text(label()) }}</span>

      <div class="relative">
        <input
          [type]="visible() ? 'text' : 'password'"
          [placeholder]="t.text(placeholder())"
          [class]="inputClasses()"
          [ngModel]="value()"
          (ngModelChange)="onInput($event)"
          (blur)="onTouched()"
        />

        <button
          type="button"
          class="absolute right-0 top-0 flex h-9 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          (click)="toggleVisibility()"
          [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
        >
          @if (visible()) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
              />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path
                d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
              />
              <path d="m2 2 20 20" />
            </svg>
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        </button>
      </div>

      @if (showStrength() && value()) {
        <div class="flex gap-1">
          @for (i of strengthBars; track i) {
            <div
              class="h-1 flex-1 rounded-full transition-all duration-300"
              [class]="i < strength() ? strengthColor() : 'bg-border'"
            ></div>
          }
        </div>
        <span class="text-xs" [class]="strengthTextColor()">
          {{ strengthLabel() }}
        </span>
      }

      @if (error()) {
        <span class="auth-field-error text-xs text-destructive">
          {{ error() }}
        </span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent implements ControlValueAccessor {
  readonly t = inject(TranslatorService);
  readonly label = input("Password");
  readonly placeholder = input("••••••••");
  readonly error = input("");
  readonly showStrength = input(false);

  readonly visible = signal(false);
  readonly value = signal("");

  readonly strengthBars = [0, 1, 2, 3];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  toggleVisibility(): void {
    this.visible.update((v) => !v);
  }

  onInput(val: string): void {
    this.value.set(val);
    this.onChangeFn(val);
  }

  strength(): number {
    const v = this.value();
    if (!v) return 0;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return score;
  }

  strengthColor(): string {
    const s = this.strength();
    if (s <= 1) return "bg-destructive";
    if (s <= 2) return "bg-amber-500";
    if (s <= 3) return "bg-blue-500";
    return "bg-emerald-500";
  }

  strengthTextColor(): string {
    const s = this.strength();
    if (s <= 1) return "text-destructive";
    if (s <= 2) return "text-amber-500";
    if (s <= 3) return "text-blue-500";
    return "text-emerald-500";
  }

  strengthLabel(): string {
    const s = this.strength();
    if (s <= 1) return this.t.text("Weak");
    if (s <= 2) return this.t.text("Fair");
    if (s <= 3) return this.t.text("Good");
    return this.t.text("Strong");
  }

  inputClasses(): string {
    return cn(
      "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-sm shadow-xs outline-none transition-[color,box-shadow]",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      this.error()
        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
        : "",
    );
  }

  /* ── ControlValueAccessor ── */

  writeValue(val: string): void {
    this.value.set(val ?? "");
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
