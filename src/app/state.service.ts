import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedReason: string = '';
  private state: any = {};

  constructor() { }
  setSelectedReason(reason: string): void {
    this.selectedReason = reason;
  }

  getSelectedReason(): string {
    return this.selectedReason;
  }

  setState(key: string, value: any) {
    this.state[key] = value;
  }

  getState(key: string): any {
    return this.state[key];
  }

  clearState(key: string) {
    delete this.state[key];
  }
}
