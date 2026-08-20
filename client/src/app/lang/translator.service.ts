import { Injectable, computed } from "@angular/core";
import { lang } from "../context/global";
import {
  TRANSLATOR,
  TEXT_TRANSLATIONS,
  type TranslatorKey,
} from "./translator";

@Injectable({ providedIn: "root" })
export class TranslatorService {
  readonly currentLanguage = computed(() => lang());

  translate(key: TranslatorKey): string {
    return TRANSLATOR[lang()][key];
  }
  text(value: string): string {
    return lang() === "ar" ? (TEXT_TRANSLATIONS[value] ?? value) : value;
  }
}
