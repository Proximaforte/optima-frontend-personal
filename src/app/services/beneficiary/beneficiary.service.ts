import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  imageUrl: string = "";
  showOriginal: boolean = false;
//  public emitImage$: EventEmitter<any> = new EventEmitter<any>();
 imageObservable$: ReplaySubject<any> = new ReplaySubject<any>();

  constructor() { }

  public setImageUrl(image: string){
    this.imageUrl = image;
  }

  public getImageUrl(){
    return this.imageUrl;
  }

  public setShowOriginal(show: boolean){
    this.showOriginal = show;
  }

  public getShowOriginal(){
    return this.showOriginal;
  }

  public returnImageUrl(image: any){
    this.imageObservable$.next(image);
   // this.emitImage$.emit(image);
  }

  public acceptImageUrl(): Observable<any>{
    return this.imageObservable$.asObservable();
  }

}
