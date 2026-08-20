import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthContainerComponent } from "../../components/auth-container.component";
import { CustomButtonComponent } from "../../components/custom-button.component";
import { CustomInputComponent } from "../../components/custom-input.component";
import { ForgotPasswordService } from "./forgot-password.service";
import { TranslatorService } from "../../lang/translator.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
    CustomButtonComponent,
    CustomInputComponent,
  ],
  providers: [ForgotPasswordService],
  template: `
    <app-auth-container
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset code"
    >
      <form
        class="flex flex-col gap-4"
        [formGroup]="svc.form"
        (ngSubmit)="svc.submit()"
      >
        <app-custom-input
          label="Email"
          type="email"
          placeholder="you@example.com"
          formControlName="email"
          [error]="svc.errors()['email'] ?? ''"
        />

        <app-custom-button
          type="submit"
          [loading]="svc.loading()"
          className="w-full"
        >
          {{ t.text("Send reset code") }}
        </app-custom-button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ t.text("Remember your password?") }}
        <a routerLink="/login" class="font-medium text-primary hover:underline">
          {{ t.text("Sign in") }}
        </a>
      </p>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  readonly svc = inject(ForgotPasswordService);
  readonly t = inject(TranslatorService);
}
