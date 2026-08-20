import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { TranslatorService } from "../../lang/translator.service";

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: "app-select",
  standalone: true,
  template: `
    <div class="relative min-w-36">
      <button
        type="button"
        class="flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-white py-0 ps-3 pe-3 text-start text-sm text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        [attr.aria-label]="t.text(ariaLabel())"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
      >
        <span class="truncate">{{ t.text(selectedLabel()) }}</span
        ><span class="text-slate-400">⌄</span>
      </button>
      @if (open()) {
        <div
          class="absolute z-40 mt-1 w-full min-w-44 overflow-hidden rounded-md border bg-white shadow-xl"
          role="listbox"
        >
          <div class="max-h-56 overflow-y-auto p-1">
            @for (option of options(); track option.value) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="String(option.value) === String(value())"
                [class]="
                  'flex h-9 w-full items-center rounded-md px-3 text-start text-sm hover:bg-slate-100 ' +
                  (String(option.value) === String(value())
                    ? 'bg-slate-100 font-medium'
                    : '')
                "
                (click)="select(option.value)"
              >
                {{ t.text(option.label) }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly t = inject(TranslatorService);
  readonly value = model("");
  readonly options = input.required<readonly SelectOption[]>();
  readonly ariaLabel = input("Select");
  readonly open = signal(false);
  readonly selectedLabel = computed(
    () =>
      this.options().find(
        (option) => String(option.value) === String(this.value()),
      )?.label ?? this.ariaLabel(),
  );
  readonly String = String;

  select(value: string | number): void {
    this.value.set(String(value));
    this.open.set(false);
  }
  toggle(): void {
    this.open.update((value) => !value);
  }
  @HostListener("document:pointerdown", ["$event"]) closeOutside(
    event: PointerEvent,
  ): void {
    if (!this.host.nativeElement.contains(event.target as Node))
      this.open.set(false);
  }
  @HostListener("keydown.escape") closeEscape(): void {
    this.open.set(false);
  }
}
