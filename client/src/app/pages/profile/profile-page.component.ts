import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ConfirmationDialogComponent } from "../../components/confirmation-dialog.component";
import { PageLayoutComponent } from "../../components/page-layout.component";
import { ButtonComponent } from "../../components/ui/button.component";
import { FileInputComponent } from "../../components/ui/file-input.component";
import { InputComponent } from "../../components/ui/input.component";
import { accountInfo } from "../../context/global";
import { TranslatorService } from "../../lang/translator.service";
import { ProfileService } from "./profile.service";
@Component({
  selector: "app-profile-page",
  standalone: true,
  imports: [
    PageLayoutComponent,
    InputComponent,
    FileInputComponent,
    ButtonComponent,
    ConfirmationDialogComponent,
  ],
  providers: [ProfileService],
  template: `<app-page-layout
      [title]="t.text('Profile')"
      [description]="t.text('Manage your display name and avatar.')"
      ><div class="grid min-w-0 gap-5">
        <section
          class="grid min-w-0 max-w-2xl gap-5 rounded-lg border bg-white p-4 sm:p-6"
        >
          <div>
            <p class="text-sm font-medium">{{ t.text("Email") }}</p>
            <p class="mt-1 break-all text-sm text-slate-500">
              {{ account()?.email }}
            </p>
          </div>
          <label class="grid min-w-0 gap-1.5"
            ><span class="text-sm font-medium">{{
              t.text("Display name")
            }}</span
            ><app-input [(value)]="svc.name"
          /></label>
          <div>
            <p class="mb-2 text-sm font-medium">{{ t.text("Avatar") }}</p>
            <app-file-input
              [initialUrl]="account()?.avatarUrl || null"
              (fileChange)="svc.avatar.set($event)"
            />
          </div>
          <div class="flex justify-end">
            <app-button [loading]="svc.loading()" (click)="svc.save()">{{
              t.text("Save profile")
            }}</app-button>
          </div>
        </section>
        <section
          class="max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6"
        >
          <h2 class="font-semibold text-red-900">
            {{ t.text("Delete account") }}
          </h2>
          <p class="mt-1 text-sm text-red-700">
            {{
              t.text(
                "Your account will be disabled and you will be signed out."
              )
            }}
          </p>
          <app-button
            [danger]="true"
            className="mt-4"
            (click)="deleteOpen.set(true)"
            >{{ t.text("Delete my account") }}</app-button
          >
        </section>
      </div></app-page-layout
    ><app-confirmation-dialog
      [open]="deleteOpen()"
      [title]="t.text('Delete your account?')"
      [message]="t.text('This action disables your account and signs you out.')"
      [confirmLabel]="t.text('Delete account')"
      [loading]="svc.loading()"
      (cancel)="deleteOpen.set(false)"
      (confirm)="svc.removeAccount()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  readonly svc = inject(ProfileService);
  readonly t = inject(TranslatorService);
  readonly account = accountInfo;
  readonly deleteOpen = signal(false);
}
