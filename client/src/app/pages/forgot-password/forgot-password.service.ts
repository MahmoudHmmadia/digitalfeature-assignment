import { Injectable, inject, signal, computed } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthApiService } from "../../api/auth.api";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";

@Injectable()
export class ForgotPasswordService {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly mutation = inject(CustomMutationService);

  readonly loading = signal(false);
  private readonly validationVersion = signal(0);

  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
  });

  constructor() {
    this.form.events.subscribe(() => {
      this.validationVersion.update((version) => version + 1);
    });
  }

  readonly errors = computed((): Record<string, string | undefined> => {
    this.validationVersion();
    const c = this.form.controls;
    const result: Record<string, string | undefined> = {};

    if (c.email.touched && c.email.errors) {
      if (c.email.errors["required"]) result["email"] = "Email is required";
      else if (c.email.errors["email"])
        result["email"] = "Please enter a valid email";
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
      const email = this.form.controls.email.value;

      const res = await this.authApi.requestNewCode({ email });

      this.mutation.success(res, { isLog: true });

      void this.router.navigate(["/reset-password"], {
        queryParams: { email },
      });
    } catch (err) {
      this.mutation.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
