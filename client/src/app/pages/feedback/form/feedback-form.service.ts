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
  readonly submitted = signal(false);
  readonly isEdit = computed(() => !!this.editId());
  readonly validationErrors = computed(() => {
    const errors: Record<string, string> = {};
    const title = this.title().trim();
    const description = this.description().trim();
    const categoryId = this.categoryId().trim();

    if (!title) errors["title"] = "Title is required";
    else if (title.length < 3 || title.length > 120)
      errors["title"] = "Title must be between 3 and 120 characters";

    if (!description) errors["description"] = "Description is required";
    else if (description.length > 5000)
      errors["description"] = "Description must be 5000 characters or fewer";

    if (!categoryId) errors["categoryId"] = "Category is required";
    else if (!/^[0-9a-fA-F]{24}$/.test(categoryId))
      errors["categoryId"] = "Please choose a valid category";

    return errors;
  });
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
    this.submitted.set(true);
    const title = this.title().trim();
    const description = this.description().trim();
    const categoryId = this.categoryId().trim();

    if (Object.keys(this.validationErrors()).length > 0) {
      this.error.set("Please correct the highlighted fields.");
      return;
    }
    this.loading.set(true);
    this.error.set("");
    try {
      const data = { title, description, categoryId };
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
