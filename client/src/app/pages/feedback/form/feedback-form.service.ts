import { Injectable, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FeedbackApiService } from "../../../api/feedback.api";
import { CustomMutationService } from "../../../hooks/use-custom-mutation.service";
import type { FeedbackCategory } from "../../../types/feedback";
@Injectable()
export class FeedbackFormService {
  private readonly api = inject(FeedbackApiService);
  private readonly mutation = inject(CustomMutationService);
  private readonly router = inject(Router);
  readonly title = signal("");
  readonly description = signal("");
  readonly categoryId = signal("");
  readonly categories = signal<FeedbackCategory[]>([]);
  readonly loading = signal(false);
  readonly loadingPage = signal(false);
  readonly editId = signal<string | null>(null);
  readonly error = signal("");
  readonly isEdit = computed(() => !!this.editId());
  async init(id?: string): Promise<void> {
    this.loadingPage.set(true);
    try {
      this.categories.set(
        (await this.api.categories({ limit: 50 })).data.materials.data,
      );
      if (id) {
        const item = (await this.api.get(id)).data.materials;
        this.editId.set(id);
        this.title.set(item.title);
        this.description.set(item.description);
        this.categoryId.set(item.categoryId);
      }
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.loadingPage.set(false);
    }
  }
  async submit(): Promise<void> {
    const title = this.title().trim();
    const description = this.description().trim();
    if (title.length < 3 || !description || !this.categoryId()) {
      this.error.set(
        "Enter a title of at least 3 characters, a description, and a category.",
      );
      return;
    }
    this.loading.set(true);
    this.error.set("");
    try {
      const data = { title, description, categoryId: this.categoryId() };
      const id = this.editId();
      const res = id
        ? await this.api.update(id, data)
        : await this.api.create(data);
      this.mutation.success(res, { isLog: true });
      const request = res.data.materials;
      void this.router.navigate(["/feedback", request.id]);
    } catch (error) {
      this.mutation.error(error);
    } finally {
      this.loading.set(false);
    }
  }
}
