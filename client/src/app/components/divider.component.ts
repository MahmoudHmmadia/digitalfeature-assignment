import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-divider",
  standalone: true,
  template: `
    <div class="relative flex items-center py-2">
      <div class="flex-1 border-t border-border"></div>
      <span class="mx-4 text-xs text-muted-foreground">{{ text() }}</span>
      <div class="flex-1 border-t border-border"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  readonly text = input("or");
}
