import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { cn } from '../../lib/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <section [class]="cardClass()">
      <ng-content />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly className = input('');

  cardClass(): string {
    return cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6 shadow-sm',
      this.className(),
    );
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `<div class="grid gap-1.5 px-6"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `<h2 class="leading-none font-semibold"><ng-content /></h2>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTitleComponent {}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `<p class="text-sm text-muted-foreground"><ng-content /></p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDescriptionComponent {}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `<div class="px-6"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardContentComponent {}
