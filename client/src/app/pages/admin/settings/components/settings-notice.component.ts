import { ChangeDetectionStrategy, Component, input } from "@angular/core";
@Component({
  selector: "app-settings-notice",
  standalone: true,
  template: `<section
    class="rounded-lg border border-amber-200 bg-amber-50 p-5"
  >
    <h2 class="font-semibold text-amber-950">{{ title() }}</h2>
    <p class="mt-2 text-sm leading-6 text-amber-800">{{ description() }}</p>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNoticeComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
