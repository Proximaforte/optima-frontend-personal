import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { environment } from 'src/app/environments/environment.prod';
import { JwtInterceptorService } from '../authentication/interceptor/jwt-interceptor.service';
import {
   PersonalDetails, 
   ResidentialDetails,
   EducationDetails,
   HealthDetails,
   FinancialDetails,
   NextOfKin,
   EmploymentDetails,
   OtherDetails,
   VerificationDetails
  } from 'src/app/models/beneficiary/beneficiary';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  imageUrl: string = "";
  showOriginal: boolean = false;

 imageObservable$: ReplaySubject<any> = new ReplaySubject<any>();
 routeObservable$: ReplaySubject<any> = new ReplaySubject<any>();
//  healthDataObservable$: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private http: HttpClient, private interceptor: JwtInterceptorService) { }

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

  public setRouteToDisplay(route: string){
  return this.routeObservable$.next(route);
  }

  public getRouteToDisplay():Observable<any>{
    return this.routeObservable$.asObservable();
  }

  public personalDetails(data: PersonalDetails): Observable<any>{
  const body = JSON.stringify(data);
  return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.personalDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public residentialDetails(data: ResidentialDetails): Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.residentialDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public educationDetails(data: EducationDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.educationDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public healthDetails(data: HealthDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.healthDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public financialDetails(data: FinancialDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.financialDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  
  public nextOfKinDetails(data: NextOfKin):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.nextOfKinDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public employmentDetails(data: EmploymentDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.employmentDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public otherDetails(data: OtherDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.otherDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  
  public Verification(data: VerificationDetails):Observable<any>{
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.verificationDetails}`, body, { headers: this.interceptor?.customHttpHeaders});
  }


}
