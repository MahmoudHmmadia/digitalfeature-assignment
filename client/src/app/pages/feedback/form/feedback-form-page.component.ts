import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { InputComponent } from "../../../components/ui/input.component";
import { SearchableCategorySelectComponent } from "../../../components/ui/searchable-select.component";
import { TextareaComponent } from "../../../components/ui/textarea.component";
import { TranslatorService } from "../../../lang/translator.service";
import { FeedbackFormService } from "./feedback-form.service";
@Component({
  selector: "app-feedback-form-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    InputComponent,
    TextareaComponent,
    SearchableCategorySelectComponent,
    ButtonComponent,
  ],
  providers: [FeedbackFormService],
  template: `<app-page-layout
    [title]="svc.isEdit() ? 'Edit feedback' : 'Create feedback'"
    description="Describe the product need clearly so others can understand and discuss it."
  >
    @if (svc.loadingPage()) {
      <p class="rounded-lg border bg-white p-8 text-center">
        {{ t.text("Loading…") }}
      </p>
    } @else {
      <section
        class="mx-auto grid max-w-2xl gap-5 rounded-lg border bg-white p-6"
      >
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">{{ t.text("Title") }}</span>
          <app-input
            placeholder="Short summary"
            [(value)]="svc.title"
            [className]="
              svc.submitted() && svc.validationErrors()['title']
                ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30'
                : ''
            "
          />
        </label>
        @if (svc.submitted() && svc.validationErrors()["title"]; as error) {
          <p class="text-xs text-destructive">{{ t.text(error) }}</p>
        }
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">{{ t.text("Description") }}</span>
          <app-textarea
            placeholder="What problem should be solved?"
            [rows]="8"
            [(value)]="svc.description"
          />
        </label>
        @if (
          svc.submitted() && svc.validationErrors()["description"];
          as error
        ) {
          <p class="text-xs text-destructive">{{ t.text(error) }}</p>
        }
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">{{ t.text("Category") }}</span>
          <app-searchable-category-select
            placeholder="Choose category"
            [(value)]="svc.categoryId"
          />
        </label>
        @if (
          svc.submitted() && svc.validationErrors()["categoryId"];
          as error
        ) {
          <p class="text-xs text-destructive">{{ t.text(error) }}</p>
        }
        @if (svc.error()) {
          <p class="text-sm text-red-600">{{ t.text(svc.error()) }}</p>
        }
        <div class="flex justify-end gap-2">
          <app-button variant="outline" (click)="router.navigateByUrl('/')">{{
            t.text("Cancel")
          }}</app-button
          ><app-button [loading]="svc.loading()" (click)="svc.submit()">{{
            t.text(svc.isEdit() ? "Save changes" : "Submit feedback")
          }}</app-button>
        </div>
      </section>
    }
  </app-page-layout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFormPageComponent implements OnInit {
  readonly svc = inject(FeedbackFormService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly t = inject(TranslatorService);
  ngOnInit(): void {
    void this.svc.init(this.route.snapshot.paramMap.get("id") ?? undefined);
  }
}
