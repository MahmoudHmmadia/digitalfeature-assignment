import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { LucideAngularModule } from "lucide-angular";
import { TranslatorService } from "../../lang/translator.service";
@Component({
  selector: "app-file-input",
  standalone: true,
  imports: [LucideAngularModule],
  template: `<div class="grid gap-3">
    <input
      #picker
      class="sr-only"
      type="file"
      [accept]="accept()"
      (change)="changed($event)"
    />
    @if (file() || initialUrl()) {
      <div
        class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
      >
        @if (previewUrl() || initialUrl()) {
          <img
            [src]="previewUrl() || initialUrl()"
            alt=""
            class="size-24 shrink-0 rounded-xl border bg-white object-cover"
          />
        } @else {
          <div
            class="grid size-24 shrink-0 place-items-center rounded-xl border bg-white text-slate-400"
          >
            <lucide-icon name="file" [size]="30" />
          </div>
        }
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-slate-900">
            {{ file()?.name || t.text("Current avatar") }}
          </p>
          @if (file()) {
            <p class="mt-1 text-xs text-slate-500">{{ fileSize() }}</p>
          }
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-md border bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
              (click)="picker.click()"
            >
              {{ t.text("Replace file") }}</button
            ><button
              type="button"
              class="rounded-md px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
              (click)="clear(picker)"
            >
              {{ t.text("Remove file") }}
            </button>
          </div>
        </div>
      </div>
    } @else {
      <button
        type="button"
        class="group grid min-h-40 place-items-center rounded-xl border-2 border-dashed p-6 text-center transition"
        [class.border-slate-900]="dragging()"
        [class.bg-slate-50]="dragging()"
        (click)="picker.click()"
        (dragover)="dragOver($event)"
        (dragleave)="dragging.set(false)"
        (drop)="drop($event)"
      >
        <span
          ><span
            class="mx-auto grid size-11 place-items-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200"
            ><lucide-icon name="upload-cloud" [size]="22" /></span
          ><span class="mt-3 block text-sm font-semibold">{{
            t.text("Drop a file here or browse")
          }}</span
          ><span class="mt-1 block text-xs text-slate-500">{{
            t.text(hint())
          }}</span></span
        >
      </button>
    }
    @if (error()) {
      <p class="text-xs text-red-600">{{ t.text(error()) }}</p>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputComponent implements OnDestroy {
  readonly t = inject(TranslatorService);
  readonly accept = input("image/*");
  readonly maxSizeMb = input(5);
  readonly hint = input("PNG, JPG or WebP up to 5 MB");
  readonly initialUrl = input<string | null>();
  readonly fileChange = output<File | null>();
  readonly file = signal<File | null>(null);
  readonly dragging = signal(false);
  readonly error = signal("");
  readonly previewUrl = signal<string | null>(null);
  readonly fileSize = computed(() => {
    const size = this.file()?.size ?? 0;
    return size >= 1048576
      ? `${(size / 1048576).toFixed(1)} MB`
      : `${Math.max(1, Math.round(size / 1024))} KB`;
  });
  changed(event: Event): void {
    this.select((event.target as HTMLInputElement).files?.[0]);
  }
  dragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }
  drop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.select(event.dataTransfer?.files?.[0]);
  }
  clear(input?: HTMLInputElement): void {
    this.revokePreview();
    this.file.set(null);
    this.error.set("");
    if (input) input.value = "";
    this.fileChange.emit(null);
  }
  private select(file?: File): void {
    if (!file) return;
    if (file.size > this.maxSizeMb() * 1048576) {
      this.error.set(`File must be smaller than ${this.maxSizeMb()} MB.`);
      return;
    }
    if (this.accept().startsWith("image/") && !file.type.startsWith("image/")) {
      this.error.set("Please choose an image file.");
      return;
    }
    this.revokePreview();
    this.file.set(file);
    this.error.set("");
    if (file.type.startsWith("image/"))
      this.previewUrl.set(URL.createObjectURL(file));
    this.fileChange.emit(file);
  }
  private revokePreview(): void {
    const url = this.previewUrl();
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
  }
  ngOnDestroy(): void {
    this.revokePreview();
  }
}
