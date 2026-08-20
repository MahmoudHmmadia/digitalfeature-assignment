import { Injectable, inject, signal, computed, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthApiService } from "../../api/auth.api";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";
import { persistAccount, type AccountInfo } from "../../context/global";

const RESEND_COOLDOWN = 60;

@Injectable()
export class VerifyOtpService implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authApi = inject(AuthApiService);
  private readonly mutation = inject(CustomMutationService);

  private timerRef: ReturnType<typeof setInterval> | null = null;

  readonly loading = signal(false);
  readonly resending = signal(false);
  readonly countdown = signal(RESEND_COOLDOWN);

  readonly canResend = computed(() => this.countdown() <= 0);

  readonly email = signal("");

  readonly form = this.fb.nonNullable.group({
    code: [
      "",
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  readonly errors = computed((): Record<string, string | undefined> => {
    const c = this.form.controls;
    const result: Record<string, string | undefined> = {};

    if (c.code.touched && c.code.errors) {
      if (c.code.errors["required"])
        result["code"] = "Verification code is required";
      else if (c.code.errors["minlength"] || c.code.errors["maxlength"])
        result["code"] = "Code must be 6 digits";
    }

    return result;
  });

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params["email"]) {
        this.email.set(params["email"]);
      }
    });

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      const res = await this.authApi.checkCode({
        email: this.email(),
        code: this.form.controls.code.value,
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

  async resendCode(): Promise<void> {
    if (!this.canResend()) return;

    this.resending.set(true);

    try {
      const res = await this.authApi.requestNewCode({
        email: this.email(),
      });

      this.mutation.success(res, { isLog: true });
      this.countdown.set(RESEND_COOLDOWN);
      this.startCountdown();
    } catch (err) {
      this.mutation.error(err);
    } finally {
      this.resending.set(false);
    }
  }

  private startCountdown(): void {
    this.clearTimer();

    this.timerRef = setInterval(() => {
      const current = this.countdown();
      if (current <= 0) {
        this.clearTimer();
        return;
      }
      this.countdown.set(current - 1);
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerRef !== null) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }
}
