import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthContainerComponent } from '../../components/auth-container.component';
import { CustomButtonComponent } from '../../components/custom-button.component';
import { CustomInputComponent } from '../../components/custom-input.component';
import { persistAccount } from '../../context/global';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AuthContainerComponent,
    CustomButtonComponent,
    CustomInputComponent,
  ],
  template: `
    <app-auth-container>
      <form
        class="flex flex-col gap-5"
        [formGroup]="form"
        (ngSubmit)="submit()"
      >
        <app-custom-input
          label="Email"
          type="email"
          formControlName="email"
        />

        <app-custom-input
          label="Password"
          type="password"
          formControlName="password"
        />

        <app-custom-button
          type="submit"
          [loading]="loading()"
        >
          Login
        </app-custom-button>
      </form>
    </app-auth-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // Replace this demo login with the real identity-provider flow.
    persistAccount({
      id: 'demo-user',
      email: this.form.controls.email.value,
      name: 'Demo Admin',
      role: 'ADMIN',
      token: 'replace-with-real-token',
    });

    this.loading.set(false);
    void this.router.navigateByUrl('/');
  }
}
