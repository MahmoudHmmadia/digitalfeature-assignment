import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatorService } from "../../lang/translator.service";
@Component({
  selector: "app-textarea",
  standalone: true,
  imports: [FormsModule],
  template: `<textarea
    [(ngModel)]="value"
    [placeholder]="t.text(placeholder())"
    [rows]="rows()"
    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
  ></textarea>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  readonly t = inject(TranslatorService);
  readonly value = model("");
  readonly placeholder = input("");
  readonly rows = input(5);
}
