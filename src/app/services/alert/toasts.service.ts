import { Injectable } from '@angular/core';
import { ErrorMessage, SuccessMessage } from 'src/app/models/APIs/endpoints';
import { Observable, BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  errorMessage: ErrorMessage = {
    message: '',
  };

  successMessage: SuccessMessage = {
    message: '',
  };

  successMsg$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  error$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {}
  private clearMessages() {
    this.successMsg$.next(null);
    this.error$.next(null);
  }

  // success
  public setSuccessMessage(message: string) {
    this.clearMessages();
    this.successMsg$.next(message);
  }

  public getSuccessMessage(): Observable<any> {
    // Filter out the initial null value or any other unwanted values
    return this.successMsg$
      .asObservable()
      .pipe(filter((message) => message !== null));
  }

  // catch errors
  public setErrorMessage(message: string) {
    this.clearMessages();
    this.error$.next(message);
  }

  public getErrorMessage(): Observable<any> {
    // Filter out the initial null value or any other unwanted values
    return this.error$
      .asObservable()
      .pipe(filter((message) => message !== null));
  }
}
