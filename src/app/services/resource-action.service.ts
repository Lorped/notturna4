import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResourceActionService {
  private readonly busy = signal(false);

  get isBusy(): boolean {
    return this.busy();
  }

  tryStart(): boolean {
    if (this.busy()) {
      return false;
    }

    this.busy.set(true);
    return true;
  }

  finish(): void {
    this.busy.set(false);
  }
}