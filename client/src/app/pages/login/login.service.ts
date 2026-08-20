import { Injectable, computed, inject, signal } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthApiService } from "../../api/auth.api";
import { persistAccount, type AccountInfo } from "../../context/global";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";

@Injectable()
export class LoginService {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly mutation = inject(CustomMutationService);

  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  readonly errors = computed((): Record<string, string | undefined> => {
    const controls = this.form.controls;
    const result: Record<string, string | undefined> = {};

    if (controls.email.touched && controls.email.errors) {
      if (controls.email.errors["required"])
        result["email"] = "Email is required";
      else if (controls.email.errors["email"])
        result["email"] = "Please enter a valid email";
    }

    if (controls.password.touched && controls.password.errors) {
      if (controls.password.errors["required"])
        result["password"] = "Password is required";
      else if (controls.password.errors["minlength"])
        result["password"] = "Password must be at least 6 characters";
    }

    return result;
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      const res = await this.authApi.login({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      });

      const account = res.data.materials;

      persistAccount({
        id: account.id,
        email: account.email,
        name: account.name ?? undefined,
        avatarUrl: account.avatarUrl,
        role: account.role === 0 ? "ADMIN" : "USER",
        token: account.token,
      } as AccountInfo);

      this.mutation.success(res);
      void this.router.navigateByUrl(
        account.role === 0 ? "/admin" : "/requests",
      );
    } catch (err) {
      this.mutation.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}
