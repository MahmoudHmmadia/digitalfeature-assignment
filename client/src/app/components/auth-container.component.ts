import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
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
    CardContentComponent,
  ],
  template: `
    <main class="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <app-card class="w-full max-w-sm">
        <app-card-header>
          <app-card-title class="text-center text-2xl">
            FeedbackHub
          </app-card-title>
        </app-card-header>

        <app-card-content>
          <ng-content />
        </app-card-content>
      </app-card>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainerComponent {}
