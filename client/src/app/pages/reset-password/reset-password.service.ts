import { Injectable, inject, signal, computed } from "@angular/core";
import {
  FormBuilder,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
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
export class ResetPasswordService {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authApi = inject(AuthApiService);
  private readonly mutation = inject(CustomMutationService);

  readonly loading = signal(false);
  private readonly validationVersion = signal(0);
  readonly email = signal("");

  readonly form = this.fb.nonNullable.group(
    {
      code: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  readonly errors = computed((): Record<string, string | undefined> => {
    this.validationVersion();
    const c = this.form.controls;
    const result: Record<string, string | undefined> = {};

    if (c.code.touched && c.code.errors) {
      if (c.code.errors["required"])
        result["code"] = "Verification code is required";
      else if (c.code.errors["minlength"] || c.code.errors["maxlength"])
        result["code"] = "Code must be 6 digits";
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

  constructor() {
    this.form.events.subscribe(() => {
      this.validationVersion.update((version) => version + 1);
    });

    this.route.queryParams.subscribe((params) => {
      if (params["email"]) {
        this.email.set(params["email"]);
      }
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationVersion.update((version) => version + 1);
      return;
    }

    this.loading.set(true);

    try {
      const v = this.form.getRawValue();

      const res = await this.authApi.resetPassword({
        email: this.email(),
        code: v.code,
        password: v.password,
      });

      this.mutation.success(res, { isLog: true, to: "/login" });
    } catch (err) {
      this.mutation.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
