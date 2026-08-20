import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { cn } from "../../lib/utils";
import { TranslatorService } from "../../lang/translator.service";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [type]="type()"
      [placeholder]="t.text(placeholder())"
      [(ngModel)]="value"
      [class]="classes()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly t = inject(TranslatorService);
  readonly type = input("text");
  readonly placeholder = input("");
  readonly className = input("");
  readonly value = model("");

  classes(): string {
    return cn(
      "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      this.className(),
    );
  }
}
