import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PageLayoutComponent } from "../../../components/page-layout.component";
import { ButtonComponent } from "../../../components/ui/button.component";
import { TranslatorService } from "../../../lang/translator.service";
import { signal } from "@angular/core";
import { AdminSettingsService } from "./settings.service";
import { ProjectSettingsComponent } from "./components/project-settings.component";
import { CategorySettingsComponent } from "./components/category-settings.component";
@Component({
  selector: "app-admin-settings-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    ButtonComponent,
    ProjectSettingsComponent,
    CategorySettingsComponent,
  ],
  providers: [AdminSettingsService],
  template: `<app-page-layout
    [title]="t.text('App settings')"
    [description]="
      t.text('Manage project configuration and feedback categories.')
    "
    ><div class="mb-4 flex gap-2 border-b">
      <app-button
        variant="ghost"
        [className]="
          tab() === 'project'
            ? 'rounded-b-none border-b-2 border-slate-950 text-slate-950'
            : ''
        "
        (click)="tab.set('project')"
        >{{ t.text("Project settings") }}</app-button
      ><app-button
        variant="ghost"
        [className]="
          tab() === 'categories'
            ? 'rounded-b-none border-b-2 border-slate-950 text-slate-950'
            : ''
        "
        (click)="tab.set('categories')"
        >{{ t.text("categories") }}</app-button
      >
    </div>
    @if (tab() === "project") {
      <app-project-settings />
    } @else {
      <app-category-settings />
    }
  </app-page-layout>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsPageComponent {
  readonly t = inject(TranslatorService);
  readonly tab = signal<"project" | "categories">("project");
}
