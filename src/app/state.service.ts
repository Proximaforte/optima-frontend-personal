import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedReason: string = '';

  constructor() { }
  setSelectedReason(reason: string): void {
    this.selectedReason = reason;
  }

  getSelectedReason(): string {
    return this.selectedReason;
  }
}
