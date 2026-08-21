import { Injectable, inject, signal, computed } from "@angular/core";
import {
  FormBuilder,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthApiService } from "../../api/auth.api";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get("password");
  const confirm = control.get("confirmPassword");

  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  if (confirm?.hasError("passwordMismatch")) {
    confirm.setErrors(null);
  }

  return null;
}

@Injectable()
export class RegisterService {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly mutation = inject(CustomMutationService);

  readonly loading = signal(false);
  private readonly validationVersion = signal(0);

  readonly form = this.fb.nonNullable.group(
    {
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(1)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  constructor() {
    this.form.events.subscribe(() => {
      this.validationVersion.update((version) => version + 1);
    });
  }

  readonly errors = computed((): Record<string, string | undefined> => {
    this.validationVersion();
    const c = this.form.controls;
    const result: Record<string, string | undefined> = {};

    if (c.firstName.touched && c.firstName.errors) {
      if (c.firstName.errors["required"])
        result["firstName"] = "First name is required";
      else if (c.firstName.errors["minlength"])
        result["firstName"] = "At least 2 characters";
    }

    if (c.lastName.touched && c.lastName.errors) {
      if (c.lastName.errors["required"])
        result["lastName"] = "Last name is required";
    }

    if (c.email.touched && c.email.errors) {
      if (c.email.errors["required"]) result["email"] = "Email is required";
      else if (c.email.errors["email"])
        result["email"] = "Please enter a valid email";
    }

    if (c.password.touched && c.password.errors) {
      if (c.password.errors["required"])
        result["password"] = "Password is required";
      else if (c.password.errors["minlength"])
        result["password"] = "Must be at least 8 characters";
    }

    if (c.confirmPassword.touched && c.confirmPassword.errors) {
      if (c.confirmPassword.errors["required"])
        result["confirmPassword"] = "Please confirm your password";
      else if (c.confirmPassword.errors["passwordMismatch"])
        result["confirmPassword"] = "Passwords do not match";
    }

    return result;
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationVersion.update((version) => version + 1);
      return;
    }

    this.loading.set(true);

    try {
      const v = this.form.getRawValue();

      const res = await this.authApi.register({
        email: v.email,
        password: v.password,
        firstName: v.firstName,
        lastName: v.lastName,
      });

      this.mutation.success(res, { isLog: true });

      void this.router.navigate(["/verify-otp"], {
        queryParams: { email: v.email },
      });
    } catch (err) {
      this.mutation.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
