import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { FeedbackApiService } from "../../api/feedback.api";
import { DebounceValue } from "../../hooks/use-debounce";
import { TranslatorService } from "../../lang/translator.service";
import type { FeedbackCategory } from "../../types/feedback";
import { ButtonComponent } from "./button.component";
import { InputComponent } from "./input.component";
@Component({
  selector: "app-searchable-category-select",
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  template: `<div class="relative">
    <app-input
      [placeholder]="placeholder()"
      [value]="search()"
      (valueChange)="onSearch($event)"
      (click)="open.set(true)"
    />
    @if (open()) {
      <div
        class="absolute z-40 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-xl"
      >
        <div class="max-h-56 overflow-y-auto p-1">
          @if (loading()) {
            <p class="p-3 text-sm text-slate-500">
              {{ t.text(loadingLabel()) }}
            </p>
          } @else if (!items().length) {
            <p class="p-3 text-sm text-slate-500">{{ t.text(emptyLabel()) }}</p>
          }
          @for (item of items(); track item.id) {
            <app-button
              variant="ghost"
              [className]="
                'w-full justify-start ' +
                (item.id === value() ? 'bg-slate-100' : '')
              "
              (click)="choose(item)"
              >{{ item.name }}</app-button
            >
          }
        </div>
        @if (pages() > 1) {
          <div class="flex items-center justify-between border-t p-2">
            <app-button
              variant="ghost"
              [disabled]="page() === 1"
              (click)="go(page() - 1)"
              >‹</app-button
            ><span class="text-xs text-slate-500"
              >{{ page() }} / {{ pages() }}</span
            ><app-button
              variant="ghost"
              [disabled]="page() === pages()"
              (click)="go(page() + 1)"
              >›</app-button
            >
          </div>
        }
      </div>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableCategorySelectComponent implements OnInit, OnDestroy {
  private readonly api = inject(FeedbackApiService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly debounced = new DebounceValue("", 350);
  readonly t = inject(TranslatorService);
  readonly value = model("");
  readonly placeholder = input("Search categories");
  readonly loadingLabel = input("Loading…");
  readonly emptyLabel = input("No categories found");
  readonly search = signal("");
  readonly items = signal<FeedbackCategory[]>([]);
  readonly loading = signal(false);
  readonly open = signal(false);
  readonly page = signal(1);
  readonly pages = signal(1);
  constructor() {
    effect(() => {
      this.debounced.value();
      void this.load();
    });
    effect(() => {
      const selected = this.items().find((item) => item.id === this.value());
      if (selected && !this.open()) this.search.set(selected.name);
    });
  }
  ngOnInit(): void {
    void this.load();
  }
  ngOnDestroy(): void {
    this.debounced.destroy();
  }
  onSearch(value: string): void {
    this.search.set(value);
    this.value.set("");
    this.page.set(1);
    this.open.set(true);
    this.debounced.next(value);
  }
  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = (
        await this.api.categories({
          search: this.debounced.value() ?? "",
          page: this.page(),
          limit: 8,
        })
      ).data.materials;
      this.items.set(result.data);
      this.pages.set(Math.max(result.pagesNumber, 1));
    } finally {
      this.loading.set(false);
    }
  }
  choose(item: FeedbackCategory): void {
    this.value.set(item.id);
    this.search.set(item.name);
    this.open.set(false);
  }
  go(page: number): void {
    this.page.set(page);
    void this.load();
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
