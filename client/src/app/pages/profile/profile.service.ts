import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FeedbackApiService } from "../../api/feedback.api";
import { accountInfo, persistAccount } from "../../context/global";
import { CustomMutationService } from "../../hooks/use-custom-mutation.service";
@Injectable()
export class ProfileService {
  private readonly api = inject(FeedbackApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly router = inject(Router);
  readonly name = signal(accountInfo()?.name ?? "");
  readonly avatar = signal<File | null>(null);
  readonly loading = signal(false);
  async save(): Promise<void> {
    if (!this.name().trim()) return;
    this.loading.set(true);
    try {
      const data = new FormData();
      data.append("name", this.name().trim());
      if (this.avatar()) data.append("avatar", this.avatar()!);
      const res = await this.api.updateProfile(data);
      const current = accountInfo();
      if (current)
        persistAccount({
          ...current,
          name: res.data.materials.name,
          avatarUrl: res.data.materials.avatarUrl ?? current.avatarUrl,
        });
      this.mutation.success(res, { isLog: true });
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.loading.set(false);
    }
  }
  async removeAccount(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.api.deleteAccount();
      this.mutation.success(res, { isLog: true });
      persistAccount(undefined);
      void this.router.navigateByUrl("/login");
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.loading.set(false);
    }
  }
}
