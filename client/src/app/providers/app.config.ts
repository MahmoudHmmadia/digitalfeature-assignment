import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import {
  CircleUserRound,
  FileText,
  Inbox,
  ListChecks,
  ListFilter,
  LogOut,
  LucideAngularModule,
  Menu,
  MessageCircle,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  SquarePlus,
  Tags,
  ThumbsUp,
  X,
} from 'lucide-angular';
import { routes } from '../routes/routes';
import { authInterceptor } from '../interceptors/auth.interceptor';


const lucideIcons = {
  CircleUserRound,
  FileText,
  Inbox,
  ListChecks,
  ListFilter,
  LogOut,
  Menu,
  MessageCircle,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  SquarePlus,
  Tags,
  ThumbsUp,
  X,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick(lucideIcons)),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient()),
  ],
};
