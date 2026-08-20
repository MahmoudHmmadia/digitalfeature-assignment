import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { lang } from "./context/global";
import { ResponseComponent } from "./components/response.component";
import { cn } from "./lib/utils";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ResponseComponent],
  template: `
    <div [class]="appClass()" [attr.dir]="lang() === 'ar' ? 'rtl' : 'ltr'">
      <router-outlet />
      <app-response />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly lang = lang;

  appClass(): string {
    return cn("min-h-screen w-full", lang() === "ar" ? "rtl" : "ltr");
  }
}
