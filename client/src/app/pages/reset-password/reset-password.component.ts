import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthContainerComponent } from '../../components/auth-container.component';
import { CustomButtonComponent } from '../../components/custom-button.component';
import { PasswordInputComponent } from '../../components/password-input.component';
import { OtpInputComponent } from '../../components/otp-input.component';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
    CustomButtonComponent,
    PasswordInputComponent,
    OtpInputComponent,
  ],
  providers: [ResetPasswordService],
  template: `
    <app-auth-container
      title="Reset password"
      [subtitle]="'Enter the code sent to ' + svc.email() + ' and your new password'"
    >
      <form
        class="flex flex-col gap-4"
        [formGroup]="svc.form"
        (ngSubmit)="svc.submit()"
      >
        <app-otp-input
          label="Verification code"
          formControlName="code"
          [error]="svc.errors()['code'] ?? ''"
        />

        <app-password-input
          label="New password"
          formControlName="password"
          [showStrength]="true"
          [error]="svc.errors()['password'] ?? ''"
        />

        <app-password-input
          label="Confirm new password"
          placeholder="••••••••"
          formControlName="confirmPassword"
          [error]="svc.errors()['confirmPassword'] ?? ''"
        />

        <app-custom-button
          type="submit"
          [loading]="svc.loading()"
          className="w-full mt-1"
        >
          Reset password
        </app-custom-button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        <a routerLink="/login" class="font-medium text-primary hover:underline">
          Back to sign in
        </a>
      </p>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  readonly svc = inject(ResetPasswordService);
}
