import { Injectable, effect } from "@angular/core";
import { lang, persistLanguage } from "../context/global";

@Injectable({ providedIn: "root" })
export class InitProviderService {
  constructor() {
    effect(() => {
      const language = lang();
      persistLanguage(language);
    });
  }
}
