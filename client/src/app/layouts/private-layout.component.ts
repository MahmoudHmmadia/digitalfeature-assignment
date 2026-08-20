import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./sidebar.component";

@Component({
  selector: "app-private-layout",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div
      class="min-h-screen w-full max-w-full bg-slate-50 text-slate-950 lg:flex"
    >
      <app-sidebar />

      <main class="min-w-0 max-w-full flex-1 pt-14 lg:pt-0">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent {}
