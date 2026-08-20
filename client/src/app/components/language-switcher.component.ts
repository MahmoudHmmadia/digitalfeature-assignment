import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { lang, persistLanguage, type Lang } from "../context/global";
import { TranslatorService } from "../lang/translator.service";
import { ButtonComponent } from "./ui/button.component";
@Component({
  selector: "app-language-switcher",
  standalone: true,
  imports: [ButtonComponent],
  template: `<div
    class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
    role="group"
    [attr.aria-label]="t.translate('language')"
  >
    <app-button
      [variant]="lang() === 'en' ? 'outline' : 'ghost'"
      className="h-8 px-3"
      (click)="set('en')"
      >{{ t.translate("english") }}</app-button
    ><app-button
      [variant]="lang() === 'ar' ? 'outline' : 'ghost'"
      className="h-8 px-3"
      (click)="set('ar')"
      >{{ t.translate("arabic") }}</app-button
    >
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly t = inject(TranslatorService);
  readonly lang = lang;
  set(value: Lang): void {
    persistLanguage(value);
  }
}
