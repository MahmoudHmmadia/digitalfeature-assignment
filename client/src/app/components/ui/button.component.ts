import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { cn } from "../../lib/utils";

@Component({
  selector: "app-button",
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="classes()"
    >
      @if (loading()) {
        <span
          class="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        ></span>
      }
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly danger = input(false);
  readonly variant = input<"primary" | "outline" | "ghost">("primary");
  readonly className = input("");

  classes(): string {
    return cn(
      "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
      this.danger()
        ? "bg-destructive text-white hover:bg-destructive/90"
        : this.variant() === "outline"
          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          : this.variant() === "ghost"
            ? "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
      this.className(),
    );
  }
}
