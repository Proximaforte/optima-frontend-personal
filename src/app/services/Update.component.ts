import { SwUpdate } from '@angular/service-worker';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private updates: SwUpdate) {
    this.updates.available.subscribe(event => {
      if (confirm('New version available. Load New Version?')) {
        this.updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}