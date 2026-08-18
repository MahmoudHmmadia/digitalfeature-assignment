import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { Router } from '@angular/router';
import { accountInfo } from '../../context/global';
import { PageLayoutComponent } from '../../components/page-layout.component';
import { CustomButtonComponent } from '../../components/custom-button.component';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../components/ui/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CustomButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
  ],
  template: `
    <app-page-layout title="dashboard">
      <div class="grid gap-4 md:grid-cols-3">
        <app-card>
          <app-card-header>
            <app-card-title>FeedbackHub</app-card-title>
            <app-card-description>
              Internal product feedback board.
            </app-card-description>
          </app-card-header>

          <app-card-content>
            <div class="flex gap-2">
              <app-custom-button>
                Requests
              </app-custom-button>

              <app-custom-button
                danger="true"
                (click)="logout()"
              >
                Logout
              </app-custom-button>
            </div>
          </app-card-content>
        </app-card>
      </div>
    </app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly router = inject(Router);

  logout(): void {
    accountInfo.set(undefined);
    void this.router.navigateByUrl('/login');
  }
}
