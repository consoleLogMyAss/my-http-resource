import { signal, WritableSignal } from '@angular/core';

export class ReactiveHttpModel<T> {
  public value: WritableSignal<T> = signal(null);
  public loading: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<any> = signal(null);

  constructor(initialValue?: T) {
    if (initialValue) {
      this.value.set(initialValue);
    }
  }
}
