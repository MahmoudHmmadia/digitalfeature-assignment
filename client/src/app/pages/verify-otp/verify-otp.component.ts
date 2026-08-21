import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthContainerComponent } from "../../components/auth-container.component";
import { CustomButtonComponent } from "../../components/custom-button.component";
import { OtpInputComponent } from "../../components/otp-input.component";
import { VerifyOtpService } from "./verify-otp.service";
import { TranslatorService } from "../../lang/translator.service";

@Component({
  selector: "app-verify-otp",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
    CustomButtonComponent,
    OtpInputComponent,
  ],
  providers: [VerifyOtpService],
  template: `
    <app-auth-container
      title="Verify your email"
      [subtitle]="t.text('We sent a code to') + ' ' + svc.email()"
    >
      <form
        class="flex flex-col gap-5"
        [formGroup]="svc.form"
        (ngSubmit)="svc.submit()"
      >
        <app-otp-input
          label="Verification code"
          formControlName="code"
          [error]="svc.errors()['code'] ?? ''"
        />

        <app-custom-button
          type="submit"
          [loading]="svc.loading()"
          className="w-full"
        >
          {{ t.text("Verify email") }}
        </app-custom-button>
      </form>

      <div class="mt-4 text-center">
        @if (svc.canResend()) {
          <button
            type="button"
            class="text-sm font-medium text-primary hover:underline disabled:opacity-50"
            [disabled]="svc.resending()"
            (click)="svc.resendCode()"
          >
            {{ t.text(svc.resending() ? "Sending..." : "Resend code") }}
          </button>
        } @else {
          <p class="text-sm text-muted-foreground">
            {{ t.text("Resend code in") }}
            <span class="font-semibold text-foreground">
              {{ svc.countdown() }}s
            </span>
          </p>
        }
      </div>

      <p class="mt-2 text-center text-sm text-muted-foreground">
        <a routerLink="/login" class="font-medium text-primary hover:underline">
          {{ t.text("Back to sign in") }}
        </a>
      </p>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpComponent {
  readonly svc = inject(VerifyOtpService);
  readonly t = inject(TranslatorService);
}
