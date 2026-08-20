import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { ButtonComponent } from "../../../components/ui/button.component";
import { InputComponent } from "../../../components/ui/input.component";
import { SearchableCategorySelectComponent } from "../../../components/ui/searchable-select.component";
import { SelectComponent } from "../../../components/ui/select.component";
import { TranslatorService } from "../../../lang/translator.service";
import type { FeedbackCategory } from "../../../types/feedback";
export interface FeedbackFilters {
  search: string;
  categoryId?: string;
  status?: number;
  sortBy: string;
}
@Component({
  selector: "app-feedback-filter",
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    ButtonComponent,
    SearchableCategorySelectComponent,
  ],
  template: `<section
    class="mb-5 grid min-w-0 gap-3 rounded-lg border bg-white p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto] xl:items-end"
  >
    <label class="grid min-w-0 gap-1.5"
      ><span class="text-xs font-medium text-slate-600">{{
        t.text("Search feedback")
      }}</span
      ><app-input placeholder="Search feedback" [(value)]="search" /></label
    ><label class="grid min-w-0 gap-1.5"
      ><span class="text-xs font-medium text-slate-600">{{
        t.text("Category")
      }}</span
      ><app-searchable-category-select [(value)]="category" /></label
    ><label class="grid gap-1.5"
      ><span class="text-xs font-medium text-slate-600">{{
        t.text("Status")
      }}</span
      ><app-select
        ariaLabel="Status"
        [options]="statusOptions()"
        [(value)]="status" /></label
    ><label class="grid gap-1.5"
      ><span class="text-xs font-medium text-slate-600">{{
        t.text("Sort")
      }}</span
      ><app-select ariaLabel="Sort" [options]="sortOptions()" [(value)]="sort"
    /></label>
    <div class="flex h-9 flex-wrap gap-2">
      <app-button (click)="submit()">{{ t.text("Apply") }}</app-button
      ><app-button variant="ghost" (click)="reset()">{{
        t.text("Reset")
      }}</app-button>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFilterComponent {
  readonly t = inject(TranslatorService);
  readonly categories = input<FeedbackCategory[]>([]);
  readonly apply = output<FeedbackFilters>();
  readonly search = signal("");
  readonly category = signal("");
  readonly status = signal("");
  readonly sort = signal("createdAt");
  readonly statusOptions = computed(() => {
    this.t.currentLanguage();
    return [
      { value: "", label: this.t.text("All statuses") },
      { value: "0", label: this.t.text("New") },
      { value: "1", label: this.t.text("Under review") },
      { value: "2", label: this.t.text("Planned") },
      { value: "3", label: this.t.text("In progress") },
      { value: "4", label: this.t.text("Done") },
      { value: "5", label: this.t.text("Declined") },
    ];
  });
  readonly sortOptions = computed(() => {
    this.t.currentLanguage();
    return [
      { value: "createdAt", label: this.t.text("Newest") },
      { value: "updatedAt", label: this.t.text("Recently updated") },
      { value: "votes", label: this.t.text("Most voted") },
      { value: "title", label: this.t.text("Title") },
    ];
  });
  submit(): void {
    this.apply.emit({
      search: this.search().trim(),
      categoryId: this.category() || undefined,
      status: this.status() === "" ? undefined : Number(this.status()),
      sortBy: this.sort(),
    });
  }
  reset(): void {
    this.search.set("");
    this.category.set("");
    this.status.set("");
    this.sort.set("createdAt");
    this.submit();
  }
}
