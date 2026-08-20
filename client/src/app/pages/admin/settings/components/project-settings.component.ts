import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { AdminSettingsService } from "../settings.service";
import { TranslatorService } from "../../../../lang/translator.service";
import { InputComponent } from "../../../../components/ui/input.component";
import { CheckboxComponent } from "../../../../components/ui/checkbox.component";
import { ButtonComponent } from "../../../../components/ui/button.component";
@Component({
  selector: "app-project-settings",
  standalone: true,
  imports: [InputComponent, CheckboxComponent, ButtonComponent],
  template: `<section class="rounded-lg border bg-white p-5">
    <h2 class="font-semibold text-slate-950">
      {{ t.text("Project settings") }}
    </h2>
    <p class="mb-5 mt-1 text-sm text-slate-500">
      {{ t.text("Manage the application version and availability.") }}
    </p>
    @if (svc.loading()) {
      <p class="text-sm text-slate-500">{{ t.text("Loading…") }}</p>
    } @else if (svc.error()) {
      <p class="text-sm text-red-600">
        {{ t.text("Could not load settings.") }}
      </p>
    } @else {
      <div class="grid max-w-xl gap-5">
        <label class="grid gap-1.5 text-sm font-medium"
          >{{ t.text("App version")
          }}<app-input placeholder="1.0.0" [(value)]="version" /></label
        ><app-checkbox
          [label]="t.text('Maintenance mode')"
          [(checked)]="maintenance"
        />
        <p class="text-sm text-slate-500">
          {{
            t.text(
              "When enabled, the application is marked as under maintenance."
            )
          }}
        </p>
        <div>
          <app-button
            [loading]="svc.saving()"
            [disabled]="!version().trim()"
            (click)="save()"
            >{{ t.text("Save changes") }}</app-button
          >
        </div>
      </div>
    }
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsComponent implements OnInit {
  readonly svc = inject(AdminSettingsService);
  readonly t = inject(TranslatorService);
  readonly version = signal("");
  readonly maintenance = signal(false);
  async ngOnInit(): Promise<void> {
    await this.svc.loadSettings();
    const value = this.svc.settings();
    if (value) {
      this.version.set(value.appVersion);
      this.maintenance.set(value.maintenanceMode);
    }
  }
  async save(): Promise<void> {
    await this.svc.saveSettings(this.version().trim(), this.maintenance());
  }
}
