import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ButtonComponent } from "./ui/button.component";

@Component({
  selector: "app-custom-button",
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button
      [type]="type()"
      [disabled]="disabled()"
      [loading]="loading()"
      [danger]="danger()"
      [className]="className()"
    >
      <ng-content />
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomButtonComponent {
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly danger = input(false);
  readonly className = input("");
}
