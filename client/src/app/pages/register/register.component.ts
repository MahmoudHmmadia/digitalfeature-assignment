import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthContainerComponent } from '../../components/auth-container.component';
import { CustomButtonComponent } from '../../components/custom-button.component';
import { CustomInputComponent } from '../../components/custom-input.component';
import { PasswordInputComponent } from '../../components/password-input.component';
import { DividerComponent } from '../../components/divider.component';
import { SocialButtonComponent } from '../../components/social-button.component';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthContainerComponent,
    CustomButtonComponent,
    CustomInputComponent,
    PasswordInputComponent,
    DividerComponent,
    SocialButtonComponent,
  ],
  providers: [RegisterService],
  template: `
    <app-auth-container
      title="Create account"
      subtitle="Get started with FeedbackHub"
    >
      <form
        class="flex flex-col gap-4"
        [formGroup]="svc.form"
        (ngSubmit)="svc.submit()"
      >
        <div class="grid grid-cols-2 gap-3">
          <app-custom-input
            label="First name"
            placeholder="John"
            formControlName="firstName"
            [error]="svc.errors()['firstName'] ?? ''"
          />

          <app-custom-input
            label="Last name"
            placeholder="Doe"
            formControlName="lastName"
            [error]="svc.errors()['lastName'] ?? ''"
          />
        </div>

        <app-custom-input
          label="Email"
          type="email"
          placeholder="you@example.com"
          formControlName="email"
          [error]="svc.errors()['email'] ?? ''"
        />

        <app-password-input
          label="Password"
          formControlName="password"
          [showStrength]="true"
          [error]="svc.errors()['password'] ?? ''"
        />

        <app-password-input
          label="Confirm password"
          placeholder="••••••••"
          formControlName="confirmPassword"
          [error]="svc.errors()['confirmPassword'] ?? ''"
        />

        <app-custom-button
          type="submit"
          [loading]="svc.loading()"
          className="w-full mt-1"
        >
          Create account
        </app-custom-button>
      </form>

      <app-divider text="or continue with" />

      <app-social-button provider="google">
        Continue with Google
      </app-social-button>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?
        <a routerLink="/login" class="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly svc = inject(RegisterService);
}
