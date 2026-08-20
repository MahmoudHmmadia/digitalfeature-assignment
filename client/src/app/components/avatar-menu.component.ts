import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  output,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";
import { accountInfo } from "../context/global";
import { TranslatorService } from "../lang/translator.service";
import { LanguageSwitcherComponent } from "./language-switcher.component";
import { ButtonComponent } from "./ui/button.component";
@Component({
  selector: "app-avatar-menu",
  standalone: true,
  imports: [ButtonComponent, LanguageSwitcherComponent, LucideAngularModule],
  template: `<div class="relative">
    @if (open()) {
      <div
        class="absolute bottom-full inset-x-0 mb-2 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
      >
        <div class="border-b border-slate-100 pb-3">
          <p class="truncate text-sm font-medium">
            {{ account()?.name || t.translate("account") }}
          </p>
          <p class="truncate text-xs text-slate-500">{{ account()?.email }}</p>
        </div>
        <div class="py-3">
          <p class="mb-2 text-xs font-medium text-slate-500">
            {{ t.translate("language") }}
          </p>
          <app-language-switcher />
        </div>
        <div class="grid gap-1 border-t border-slate-100 pt-2">
          @if (account()?.role === "USER") {
            <app-button
              variant="ghost"
              className="w-full justify-start"
              (click)="profile()"
              ><lucide-icon name="circle-user-round" [size]="18" />{{
                t.translate("profile")
              }}</app-button
            >
          }
          <app-button
            variant="ghost"
            className="w-full justify-start text-red-700 hover:bg-red-50"
            (click)="requestLogout()"
            ><lucide-icon name="log-out" [size]="18" />{{
              t.translate("logout")
            }}</app-button
          >
        </div>
      </div>
    }
    <app-button
      variant="ghost"
      className="w-full justify-start px-2"
      (click)="open.update(toggle)"
      ><span
        class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-950 text-sm font-semibold text-white"
      >
        @if (account()?.avatarUrl) {
          <img
            [src]="account()?.avatarUrl"
            alt=""
            class="size-full object-cover"
          />
        } @else {
          {{ initial() }}
        }</span
      ><span class="min-w-0 text-start"
        ><span class="block truncate text-sm font-medium text-slate-900">{{
          account()?.name || t.translate("account")
        }}</span
        ><span class="block truncate text-xs font-normal text-slate-500">{{
          account()?.email
        }}</span></span
      ></app-button
    >
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarMenuComponent {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly t = inject(TranslatorService);
  readonly account = accountInfo;
  readonly open = signal(false);
  readonly logout = output<void>();
  readonly toggle = (value: boolean) => !value;
  @HostListener("document:pointerdown", ["$event"]) closeOnOutside(
    event: PointerEvent,
  ): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node))
      this.open.set(false);
  }
  @HostListener("focusout", ["$event"]) closeOnBlur(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() && (!next || !this.host.nativeElement.contains(next)))
      this.open.set(false);
  }
  initial(): string {
    return (this.account()?.name || this.account()?.email || "A")
      .charAt(0)
      .toUpperCase();
  }
  profile(): void {
    this.open.set(false);
    void this.router.navigateByUrl("/profile");
  }
  requestLogout(): void {
    this.open.set(false);
    this.logout.emit();
  }
}
