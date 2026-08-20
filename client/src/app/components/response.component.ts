import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { response } from "../context/global";
import { ButtonComponent } from "./ui/button.component";
import { TranslatorService } from "../lang/translator.service";

@Component({
  selector: "app-response",
  standalone: true,
  imports: [ButtonComponent],
  template: `
    @if (responseValue(); as current) {
      <div
        class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        role="presentation"
        (click)="close()"
      >
        <section
          class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
          role="alertdialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <div [class]="accentClass(current.type)"></div>
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div [class]="iconClass(current.type)">
                {{ icon(current.type) }}
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-lg font-semibold text-slate-950">
                  {{ title(current.type) }}
                </h2>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ current.message }}
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <app-button (click)="close()">{{
                t.translate("done")
              }}</app-button>
            </div>
          </div>
        </section>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseComponent {
  readonly t = inject(TranslatorService);
  readonly responseValue = response.asReadonly();

  close(): void {
    response.set(undefined);
  }
  title(type: "success" | "error" | "warning"): string {
    return this.t.translate(type);
  }
  icon(type: "success" | "error" | "warning"): string {
    return type === "success" ? "✓" : type === "warning" ? "!" : "×";
  }
  accentClass(type: string): string {
    return `h-1 ${type === "success" ? "bg-emerald-500" : type === "warning" ? "bg-amber-500" : "bg-red-500"}`;
  }
  iconClass(type: string): string {
    return `grid size-11 shrink-0 place-items-center rounded-full text-xl font-bold ${type === "success" ? "bg-emerald-100 text-emerald-700" : type === "warning" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`;
  }
}
