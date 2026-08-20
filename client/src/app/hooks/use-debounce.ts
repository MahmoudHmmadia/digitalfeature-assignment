import { signal, type Signal } from "@angular/core";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

export class DebounceValue<T> {
  private readonly valueSignal = signal<T | undefined>(undefined);
  private readonly destroy$ = new Subject<void>();

  readonly value: Signal<T | undefined> = this.valueSignal.asReadonly();

  constructor(initialValue: T, delay = 400) {
    this.valueSignal.set(initialValue);

    const source$ = new Subject<T>();

    source$
      .pipe(
        debounceTime(delay),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => this.valueSignal.set(value));

    this.next = (value: T) => source$.next(value);
  }

  next: (value: T) => void = () => undefined;

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
