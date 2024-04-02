import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError, map, tap, throwError } from 'rxjs';
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
  VerificationDetails,
  MaritalDetails,
  PaginationParams,
  NINParameter,
  Verification,
  filterParams
} from 'src/app/models/beneficiary/beneficiary';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  imageUrl: string = "";
  showOriginal: boolean = false;

  imageObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  routeObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  beneficiaryDataObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  filterParams!: filterParams;
  pagination: PaginationParams ={
    size: 10,
    page: 1
  }

  constructor(
    private http: HttpClient,
    private interceptor: JwtInterceptorService,
  ) { }

  public setImageUrl(image: string) {
    this.imageUrl = image;
  }

  public getImageUrl() {
    return this.imageUrl;
  }

  public setShowOriginal(show: boolean) {
    this.showOriginal = show;
  }

  public getShowOriginal() {
    return this.showOriginal;
  }

  public setFilterParams(filterParams: filterParams) {
    this.filterParams = filterParams;

  }

  public getFilterParams() {
    return this.filterParams;
  }

  public returnImageUrl(image: any) {
    this.imageObservable$.next(image);
    // this.emitImage$.emit(image);
  }

  public acceptImageUrl(): Observable<any> {
    return this.imageObservable$.asObservable();
  }

  public setRouteToDisplay(route: string) {
    return this.routeObservable$.next(route);
  }

  public getRouteToDisplay(): Observable<any> {
    return this.routeObservable$.asObservable();
  }

  public setBeneficiaryProfile(beneficiary: any) {
    return this.beneficiaryDataObservable$.next(beneficiary);
  }

  public getBeneficiaryProfile(): Observable<any> {
    return this.beneficiaryDataObservable$.asObservable();
  }

  public verifyNIN(nin: string): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.verifyNIN}?nin=${nin}`, { headers: this.interceptor?.customHttpHeaders })
  }

  //api/v1/otp/agent/generate/89989

  public verifyNINOTP(Verification: Verification): Observable<any> {
    const body = JSON.stringify(Verification);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.verificationOTP}`, body, { headers: this.interceptor?.customHttpHeaders })
    // return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.verifyOTP}/${otp}`, { headers: this.interceptor?.customHttpHeaders})
  }

  public personalDetails(data: PersonalDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.personalDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public residentialDetails(data: ResidentialDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.residentialDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public educationDetails(data: EducationDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.educationDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public healthDetails(data: HealthDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.healthDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public financialDetails(data: FinancialDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.financialDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }


  public nextOfKinDetails(data: NextOfKin): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.nextOfKinDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public employmentDetails(data: EmploymentDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.employmentDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public otherDetails(data: OtherDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.otherDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }


  public Verification(data: VerificationDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.verificationDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public maritalDetails(data: MaritalDetails): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.maritalDetails}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public getAllBeneficiaries(paginationParams: PaginationParams): Observable<any> {
    const params = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page));
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getAllBeneficiaries}`, { headers: this.interceptor?.customHttpHeaders, params: params });
  }

  public getAllIncompleteBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {
    const params = new HttpParams()
      ?.set('crimeType', filterParams?.crimeType)
      ?.set('currentHealthCondition', filterParams?.currentHealthCondition)
      ?.set('educationFunding', filterParams?.educationFunding)
      ?.set('educationLevel', filterParams?.educationLevel)
      ?.set('filterString', filterParams?.filterString)
      ?.set('gender', filterParams?.gender)
      ?.set('healthCondition', filterParams?.healthCondition)
      ?.set('houseOwner', filterParams?.houseOwner)
      ?.set('inSchool', filterParams?.inSchool)
      ?.set('lga', filterParams?.lga)
      ?.set('maritalStatus', filterParams?.maritalStatus)
      ?.set('size', String(paginationParams?.size))
      ?.set('page', String(paginationParams?.page))
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getIncompleteBeneficiaries}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }

  public getAllBeneficiaryProfiles(ssid: any): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getBeneficiaryProfile}/${ssid}`, { headers: this.interceptor?.customHttpHeaders });
  }

  public getFilteredBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {
    const params = new HttpParams()
      ?.set('crimeType', String(filterParams?.crimeType))
      ?.set('currentHealthCondition', String(filterParams?.currentHealthCondition))
      ?.set('educationFunding', String(filterParams?.educationFunding))
      ?.set('educationLevel', String(filterParams?.educationLevel))
      ?.set('filterString', String(filterParams?.filterString))
      ?.set('gender', String(filterParams?.gender))
      ?.set('healthCondition', String(filterParams?.healthCondition))
      ?.set('houseOwner', String(filterParams?.houseOwner))
      ?.set('inSchool', String(filterParams?.inSchool))
      ?.set('lga', String(filterParams?.lga))
      ?.set('maritalStatus', String(filterParams?.maritalStatus))
      ?.set('size', String(paginationParams?.size))
      ?.set('page', String(paginationParams?.page))
      console.log('params>>>', params);
      console.log('payload>>>', filterParams);
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getFilteredBeneficiaries}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }

}
