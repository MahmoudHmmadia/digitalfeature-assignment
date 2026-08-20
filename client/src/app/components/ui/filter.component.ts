import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  inject,
} from "@angular/core";
import { InputComponent } from "./input.component";
import { SelectComponent, type SelectOption } from "./select.component";
import { ButtonComponent } from "./button.component";
import { TranslatorService } from "../../lang/translator.service";

export interface FilterResult {
  search: string;
  value: string;
}

@Component({
  selector: "app-filter",
  standalone: true,
  imports: [InputComponent, SelectComponent, ButtonComponent],
  template: `<section
    class="mb-4 grid min-w-0 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
  >
    <app-input
      className="h-10"
      [placeholder]="searchPlaceholder()"
      [(value)]="search"
    /><app-select
      [options]="options()"
      [ariaLabel]="selectLabel()"
      [(value)]="value"
    /><app-button
      className="h-10"
      (click)="apply.emit({ search: search().trim(), value: value() })"
      >{{ t.text(applyLabel()) }}</app-button
    >
    @if (search() || value() !== defaultValue()) {
      <app-button variant="ghost" className="h-10" (click)="reset()">{{
        t.text(resetLabel())
      }}</app-button>
    }
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  readonly t = inject(TranslatorService);
  readonly searchPlaceholder = input("Search");
  readonly selectLabel = input("Filter");
  readonly applyLabel = input("Apply");
  readonly resetLabel = input("Reset");
  readonly defaultValue = input("all");
  readonly options = input.required<readonly SelectOption[]>();
  readonly apply = output<FilterResult>();
  readonly search = signal("");
  readonly value = signal("all");
  reset(): void {
    this.search.set("");
    this.value.set(this.defaultValue());
    this.apply.emit({ search: "", value: this.defaultValue() });
  }
}
