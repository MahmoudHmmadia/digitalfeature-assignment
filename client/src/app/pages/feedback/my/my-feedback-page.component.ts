import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FeedbackListPageComponent } from "../list/feedback-list-page.component";
@Component({
  selector: "app-my-feedback-page",
  standalone: true,
  imports: [FeedbackListPageComponent],
  template: `<app-feedback-list-page [mine]="true" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFeedbackPageComponent {}
