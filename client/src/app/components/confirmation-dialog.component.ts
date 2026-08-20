import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TranslatorService } from "../lang/translator.service";
import { ButtonComponent } from "./ui/button.component";
@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [ButtonComponent],
  template: `@if (open()) {
    <div
      class="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="presentation"
      (click)="cancel.emit()"
    >
      <section
        class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-labelledby]="dialogId"
        (click)="$event.stopPropagation()"
      >
        <div class="h-1 bg-red-500"></div>
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div
              class="grid size-11 shrink-0 place-items-center rounded-full bg-red-100 text-xl font-bold text-red-700"
            >
              !
            </div>
            <div>
              <h2 [id]="dialogId" class="text-lg font-semibold text-slate-950">
                {{ t.text(title()) }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ t.text(message()) }}
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <app-button
              variant="outline"
              [disabled]="loading()"
              (click)="cancel.emit()"
              >{{ t.text(cancelLabel()) }}</app-button
            ><app-button
              [danger]="danger()"
              [loading]="loading()"
              (click)="confirm.emit()"
              >{{ t.text(confirmLabel()) }}</app-button
            >
          </div>
        </div>
      </section>
    </div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  readonly t = inject(TranslatorService);
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input("Confirm");
  readonly cancelLabel = input("Cancel");
  readonly danger = input(true);
  readonly loading = input(false);
  readonly confirm = output<void>();
  readonly cancel = output<void>();
  readonly dialogId = `confirmation-${Math.random().toString(36).slice(2)}`;
}
