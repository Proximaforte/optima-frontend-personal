import { Injectable } from '@angular/core';
import { ErrorMessage, SuccessMessage } from 'src/app/models/APIs/endpoints';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  errorMessage: ErrorMessage = {
    message: ''
  };

  successMessage: SuccessMessage = {
    message: ''
  };

  successMsg$: ReplaySubject<any> = new ReplaySubject<any>();
  error$: ReplaySubject<any> = new ReplaySubject<any>();

  constructor() { }

  //success
  public setSuccessMessage(message: string){
   return this.successMsg$.next(message);
  }

  public getSuccessMessage(){
    return this.successMsg$.asObservable();
  }

  //catch errs
  public setErrorMessage(message: string){
   return this.error$.next(message);
  }

  public getErrorMessage(){
    return this.error$.asObservable();
  }


}
