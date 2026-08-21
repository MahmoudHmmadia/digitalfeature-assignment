import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { AdminSettingsService } from "../settings.service";
import { TranslatorService } from "../../../../lang/translator.service";
import type { FeedbackCategory } from "../../../../types/feedback";
import { InputComponent } from "../../../../components/ui/input.component";
import { ButtonComponent } from "../../../../components/ui/button.component";
import { ConfirmationDialogComponent } from "../../../../components/confirmation-dialog.component";
import {
  FilterComponent,
  type FilterResult,
} from "../../../../components/ui/filter.component";
import { PaginationComponent } from "../../../../components/ui/pagination.component";
@Component({
  selector: "app-category-settings",
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    ConfirmationDialogComponent,
    FilterComponent,
    PaginationComponent,
  ],
  template: `<div
      class="grid gap-4 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]"
    >
      <section class="rounded-lg border bg-white p-5">
        <h2 class="font-semibold">
          {{ t.text(editing() ? "Edit category" : "Create category") }}
        </h2>
        <div class="mt-4 grid gap-4">
          <label class="grid gap-1.5 text-sm font-medium"
            >{{ t.text("Name")
            }}<app-input placeholder="Category name" [(value)]="name" /></label
          ><label class="grid gap-1.5 text-sm font-medium"
            >{{ t.text("Description")
            }}<app-input
              placeholder="Optional description"
              [(value)]="description"
          /></label>
          <div class="flex gap-2">
            <app-button
              [loading]="svc.saving()"
              [disabled]="name().trim().length < 2"
              (click)="submit()"
              >{{
                t.text(editing() ? "Save changes" : "Create category")
              }}</app-button
            >
            @if (editing()) {
              <app-button variant="ghost" (click)="reset()">{{
                t.text("Cancel")
              }}</app-button>
            }
          </div>
        </div>
      </section>
      <section class="overflow-hidden rounded-lg border bg-white">
        <div class="border-b p-5">
          <h2 class="font-semibold">{{ t.text("Categories") }}</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{
              t.text(
                "Create and manage the categories shown in searchable selects."
              )
            }}
          </p>
          <app-filter
            class="mt-4 block"
            searchPlaceholder="Search categories"
            selectLabel="Sort categories"
            [options]="sortOptions"
            defaultValue="name-asc"
            (apply)="filter($event)"
          />
        </div>
        @if (svc.operationError()) {
          <p class="border-b bg-red-50 px-5 py-3 text-sm text-red-700">
            {{ t.text(svc.operationError()) }}
          </p>
        }
        @if (svc.loading()) {
          <p class="p-6 text-sm text-slate-500">{{ t.text("Loading…") }}</p>
        } @else if (!svc.categories().length) {
          <p class="p-6 text-sm text-slate-500">
            {{ t.text("No categories found") }}
          </p>
        } @else {
          @for (category of svc.categories(); track category.id) {
            <article
              class="flex items-start justify-between gap-4 border-b p-4 last:border-0"
            >
              <div>
                <p class="font-medium">{{ category.name }}</p>
                @if (category.description) {
                  <p class="mt-1 text-sm text-slate-500">
                    {{ category.description }}
                  </p>
                }
              </div>
              <div class="flex gap-2">
                <app-button variant="outline" (click)="edit(category)">{{
                  t.text("Edit")
                }}</app-button
                ><app-button [danger]="true" (click)="removing.set(category)">{{
                  t.text("Delete")
                }}</app-button>
              </div>
            </article>
          }
        }
        <app-pagination
          [page]="svc.page()"
          [pages]="svc.pages()"
          [total]="svc.total()"
          itemLabel="categories"
          (pageChange)="svc.goToCategoryPage($event)"
        />
      </section>
    </div>
    <app-confirmation-dialog
      [open]="!!removing()"
      title="Delete category?"
      message="This permanently deletes the category if it is not used by feedback."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      [loading]="svc.saving()"
      (cancel)="removing.set(null)"
      (confirm)="remove()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySettingsComponent implements OnInit {
  readonly svc = inject(AdminSettingsService);
  readonly t = inject(TranslatorService);
  readonly name = signal("");
  readonly description = signal("");
  readonly editing = signal<FeedbackCategory | null>(null);
  readonly removing = signal<FeedbackCategory | null>(null);
  readonly sortOptions = [
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "createdAt-desc", label: "Newest" },
    { value: "createdAt-asc", label: "Oldest" },
  ] as const;
  ngOnInit(): void {
    void this.svc.loadCategories();
  }
  edit(item: FeedbackCategory): void {
    this.editing.set(item);
    this.name.set(item.name);
    this.description.set(item.description ?? "");
  }
  reset(): void {
    this.editing.set(null);
    this.name.set("");
    this.description.set("");
  }
  async submit(): Promise<void> {
    const item = this.editing();
    const saved = item
      ? await this.svc.updateCategory(
          item.id,
          this.name().trim(),
          this.description().trim(),
        )
      : await this.svc.createCategory(
          this.name().trim(),
          this.description().trim(),
        );
    if (saved) this.reset();
  }
  async remove(): Promise<void> {
    const item = this.removing();
    if (!item) return;
    const deleted = await this.svc.deleteCategory(item.id);
    this.removing.set(null);
    if (deleted && this.editing()?.id === item.id) this.reset();
  }
  filter(result: FilterResult): void {
    this.svc.applyCategoryFilters(result.search, result.value);
  }
}
