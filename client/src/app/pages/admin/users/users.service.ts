import { Injectable, inject, signal } from "@angular/core";
import { AdminApiService, type AdminAccount } from "../../../api/admin.api";
import { CustomMutationService } from "../../../hooks/use-custom-mutation.service";
import { CustomQueryService } from "../../../hooks/use-custom-query.service";

@Injectable()
export class AdminUsersService {
  private readonly api = inject(AdminApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly query = inject(CustomQueryService);
  readonly users = signal<AdminAccount[]>([]);
  readonly loading = signal(false);
  readonly mutatingId = signal<string | null>(null);
  readonly error = signal(false);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly search = signal("");
  readonly state = signal<"all" | "active" | "suspended" | "deleted">("all");

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const state = this.state();
      const res = await this.api.getUsers({
        page: this.page(),
        limit: 10,
        name: this.search() || undefined,
        isSuspended:
          state === "active" ? false : state === "suspended" ? true : undefined,
        isDeleted:
          state === "deleted"
            ? true
            : state === "active" || state === "suspended"
              ? false
              : undefined,
      });
      const result = res.data.materials;
      this.users.set(result.data);
      this.pages.set(Math.max(1, result.pagesNumber));
      this.total.set(result.totalCount);
    } catch (error) {
      this.error.set(true);
      this.query.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }

  async applyFilters(
    search: string,
    state: "all" | "active" | "suspended" | "deleted",
  ): Promise<void> {
    this.search.set(search.trim());
    this.state.set(state);
    this.page.set(1);
    await this.load();
  }
  async goTo(page: number): Promise<void> {
    if (page < 1 || page > this.pages()) return;
    this.page.set(page);
    await this.load();
  }
  async toggle(user: AdminAccount): Promise<void> {
    this.mutatingId.set(user.id);
    try {
      const res = await this.api.toggleSuspended(user.id);
      this.mutation.success(res, { isLog: true });
      await this.query.invalidate(["admin-users"]);
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.mutatingId.set(null);
    }
  }
  async setDeleted(user: AdminAccount): Promise<void> {
    this.mutatingId.set(user.id);
    try {
      const res = await this.api.setDeleted(user.id, !user.isDeleted);
      this.mutation.success(res, { isLog: true });
      await this.query.invalidate(["admin-users"]);
      await this.load();
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.mutatingId.set(null);
    }
  }
}
