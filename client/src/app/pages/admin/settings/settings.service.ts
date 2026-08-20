import { Injectable, inject, signal } from "@angular/core";
import { AdminApiService, type AppSettings } from "../../../api/admin.api";
import type { FeedbackCategory } from "../../../types/feedback";
@Injectable()
export class AdminSettingsService {
  private readonly api = inject(AdminApiService);
  readonly settings = signal<AppSettings | null>(null);
  readonly categories = signal<FeedbackCategory[]>([]);
  readonly page = signal(1); readonly pages = signal(1); readonly total = signal(0); readonly search = signal(''); readonly sort = signal('name-asc'); readonly operationError = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal(false);
  async loadSettings(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      this.settings.set((await this.api.getSettings()).data.materials);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
  async saveSettings(
    appVersion: string,
    maintenanceMode: boolean,
  ): Promise<void> {
    this.saving.set(true);
    try {
      this.settings.set(
        (await this.api.updateSettings({ appVersion, maintenanceMode })).data
          .materials,
      );
    } finally {
      this.saving.set(false);
    }
  }
  async loadCategories(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const [sortBy, sortOrder] = this.sort().split('-');
      const result = (await this.api.getCategories({ page: this.page(), limit: 8, search: this.search(), sortBy, sortOrder })).data.materials;
      this.categories.set(result.data); this.pages.set(Math.max(result.pagesNumber, 1)); this.total.set(result.totalCount);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
  async createCategory(name: string, description: string): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.createCategory({ name, description });
      await this.loadCategories();
    } finally {
      this.saving.set(false);
    }
  }
  async updateCategory(
    id: string,
    name: string,
    description: string,
  ): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.updateCategory(id, { name, description });
      await this.loadCategories();
    } finally {
      this.saving.set(false);
    }
  }
  async deleteCategory(id: string): Promise<void> {
    this.saving.set(true);
    this.operationError.set('');
    try {
      await this.api.deleteCategory(id);
      await this.loadCategories();
    } catch (error: any) {
      this.operationError.set(error?.response?.data?.message ?? 'Could not delete category.');
    } finally {
      this.saving.set(false);
    }
  }
  applyCategoryFilters(search: string, sort: string): void { this.search.set(search); this.sort.set(sort); this.page.set(1); void this.loadCategories(); }
  goToCategoryPage(page: number): void { if (page < 1 || page > this.pages()) return; this.page.set(page); void this.loadCategories(); }
}
