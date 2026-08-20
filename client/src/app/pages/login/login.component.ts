import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthContainerComponent } from "../../components/auth-container.component";
import { CustomButtonComponent } from "../../components/custom-button.component";
import { CustomInputComponent } from "../../components/custom-input.component";
import { PasswordInputComponent } from "../../components/password-input.component";
import { DividerComponent } from "../../components/divider.component";
import { SocialButtonComponent } from "../../components/social-button.component";
import { LoginService } from "./login.service";
import { TranslatorService } from "../../lang/translator.service";

@Component({
  selector: "app-login",
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
  providers: [LoginService],
  template: `
    <app-auth-container
      title="Welcome back"
      subtitle="Sign in to your FeedbackHub account"
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

        <div class="grid gap-1.5">
          <app-password-input
            label="Password"
            formControlName="password"
            [error]="svc.errors()['password'] ?? ''"
          />

          <a
            routerLink="/forgot-password"
            class="justify-self-end text-xs font-medium text-primary hover:underline"
          >
            {{ t.text("Forgot password?") }}
          </a>
        </div>

        <app-custom-button
          type="submit"
          [loading]="svc.loading()"
          className="w-full mt-1"
        >
          {{ t.text("Sign in") }}
        </app-custom-button>
      </form>

      <p class="mt-4 text-center text-sm text-muted-foreground">
        {{ t.text("Don't have an account?") }}
        <a
          routerLink="/register"
          class="font-medium text-primary hover:underline"
        >
          {{ t.text("Create account") }}
        </a>
      </p>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly svc = inject(LoginService);
  readonly t = inject(TranslatorService);
}
