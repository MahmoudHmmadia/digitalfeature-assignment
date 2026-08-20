import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from "@angular/core";
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from "./ui/card.component";
import { LanguageSwitcherComponent } from "./language-switcher.component";
import { TranslatorService } from "../lang/translator.service";

@Component({
  selector: "app-auth-container",
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    LanguageSwitcherComponent,
  ],
  template: `
    <main
      class="auth-page-bg relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4"
    >
      <div class="absolute end-4 top-4 z-20"><app-language-switcher /></div>
      <!-- Decorative blobs -->
      <div class="auth-blob auth-blob--1"></div>
      <div class="auth-blob auth-blob--2"></div>

      <div class="auth-card-entrance relative z-10 w-full max-w-md">
        <app-card className="auth-glass-card border-0 shadow-xl">
          <app-card-header>
            <app-card-title class="text-center text-2xl">
              {{ t.text(title()) }}
            </app-card-title>
            @if (subtitle()) {
              <app-card-description class="text-center">
                {{ t.text(subtitle()) }}
              </app-card-description>
            }
          </app-card-header>

          <app-card-content>
            <ng-content />
          </app-card-content>
        </app-card>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainerComponent {
  readonly t = inject(TranslatorService);
  readonly title = input("FeedbackHub");
  readonly subtitle = input("");
}
