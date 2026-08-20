import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
@Component({
  selector: "app-checkbox",
  standalone: true,
  template: `<label
    class="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
    ><input
      type="checkbox"
      class="size-4 rounded border-slate-300"
      [checked]="checked()"
      (change)="checked.set(!checked())"
    />{{ label() }}</label
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  readonly checked = model(false);
  readonly label = input.required<string>();
}
