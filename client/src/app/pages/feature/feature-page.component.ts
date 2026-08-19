import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '../../components/page-layout.component';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../components/ui/card.component';

interface FeaturePageData {
  title: string;
  description: string;
  items: string[];
}

const fallbackData: FeaturePageData = {
  title: 'Workspace',
  description: 'Manage FeedbackHub activity from this workspace.',
  items: ['Review the latest activity', 'Use filters to focus the list', 'Open items to continue work'],
};

@Component({
  selector: 'app-feature-page',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
  ],
  template: `
    <app-page-layout
      [title]="pageData().title"
      [description]="pageData().description"
    >
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (item of pageData().items; track item) {
          <app-card className="rounded-md border-slate-200 bg-white shadow-sm">
            <app-card-header>
              <app-card-title>{{ item }}</app-card-title>
              <app-card-description>
                This section is ready for the next API-backed implementation step.
              </app-card-description>
            </app-card-header>

            <app-card-content>
              <div class="h-2 rounded-full bg-slate-100">
                <div class="h-2 w-2/3 rounded-full bg-slate-900"></div>
              </div>
            </app-card-content>
          </app-card>
        }
      </div>
    </app-page-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly pageData = signal<FeaturePageData>(this.readData());

  constructor() {
    this.route.data.subscribe(() => this.pageData.set(this.readData()));
  }

  private readData(): FeaturePageData {
    return (this.route.snapshot.data['page'] as FeaturePageData | undefined) ?? fallbackData;
  }
}
