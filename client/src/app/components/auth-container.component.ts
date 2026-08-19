import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from './ui/card.component';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
  ],
  template: `
    <main class="auth-page-bg relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <!-- Decorative blobs -->
      <div class="auth-blob auth-blob--1"></div>
      <div class="auth-blob auth-blob--2"></div>

      <div class="auth-card-entrance relative z-10 w-full max-w-md">
        <app-card className="auth-glass-card border-0 shadow-xl">
          <app-card-header>
            <app-card-title class="text-center text-2xl">
              {{ title() }}
            </app-card-title>
            @if (subtitle()) {
              <app-card-description class="text-center">
                {{ subtitle() }}
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
  readonly title = input('FeedbackHub');
  readonly subtitle = input('');
}
