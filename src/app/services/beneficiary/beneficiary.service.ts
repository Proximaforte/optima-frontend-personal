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
  filterParams,
  Occupation
} from 'src/app/models/beneficiary/beneficiary';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  imageUrl: string = "";
  showOriginal: boolean = false;

  imageObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  routeObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  beneficiaryDataObservable$: ReplaySubject<any> = new ReplaySubject<any>();
  filterBeneficiaries$: ReplaySubject<any> = new ReplaySubject<any>();
  filterParams!: filterParams;
  pagination: PaginationParams = {
    size: 10,
    page: 1
  }
  params: any;
  personalDetailsObj:any = {}

  constructor(
    private http: HttpClient,
    private interceptor: JwtInterceptorService,
  ) { 
    this.setBeneficiaryFilter({});
  }

  public setImageUrl(image: string) {
    this.imageUrl = image;
  }

  public getImageUrl() {
    return this.imageUrl;
  }

  public setPersonalDetails(details:any){
    this.personalDetailsObj = details;
  }

  public getPersonalDetails(){
    return this.personalDetailsObj;
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

  public setBeneficiaryFilter(filterParams: filterParams){
    this.filterBeneficiaries$.next(filterParams);
  }

  public getBeneficiaryParams():Observable<any>{
    return this.filterBeneficiaries$.asObservable();
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

  public verifyNINOTP(Verification: Verification | any): Observable<any> {
    const body = JSON.stringify(Verification);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.verificationOTP}`, body, { headers: this.interceptor?.customHttpHeaders })
    // return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.verifyOTP}/${otp}`, { headers: this.interceptor?.customHttpHeaders})
  }

  public generateOTP(parameter: string): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.verifyOTP}/${parameter}`, { headers: this.interceptor?.customHttpHeaders })
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

  public occupationDetails(data: Occupation): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.occupataion}`, body, { headers: this.interceptor?.customHttpHeaders });
  }

  public onboardingSubmitted(phoneNumber: string): Observable<any> {
    const body = JSON.stringify({phoneNumber: phoneNumber});
    return this.http.post(`${environment?.baseUrl}/${endpoints?.onboardingSuccesfull}`, body, { headers: this.interceptor?.customHttpHeaders});
  }

  public getAllBeneficiaries(paginationParams: PaginationParams): Observable<any> {
    const params = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page));
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getAllBeneficiaries}`, { headers: this.interceptor?.customHttpHeaders, params: params });
  }

  public getAllIncompleteBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {
   // console.log("incompleted filterParams>>", filterParams);
    const params: any = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page))
    let crimeType: any = filterParams?.crimeType === undefined ? '' : `crimeType=${filterParams?.crimeType}&`;
    let currentHealthCondition: any =  filterParams?.currentHealthCondition === undefined ? '' : `currentHealthCondition=${filterParams?.currentHealthCondition}&`;
    let educationFunding: any = filterParams?.educationFunding === undefined ? '' : `educationFunding=${filterParams?.educationFunding}&`;
    let educationLevel: any = filterParams?.educationLevel === undefined ? '' : `educationLevel=${filterParams?.educationLevel}&`;
    let filterString: any = filterParams?.filterString === undefined ? '' : `filterString=${filterParams?.filterString}&`;
    let gender: any = filterParams?.gender === undefined ? '' : `gender=${filterParams?.gender}&`;
    let healthCondition: any = filterParams?.healthCondition === undefined ? '' : `healthCondition=${filterParams?.healthCondition}&`;
    let houseOwner: any = filterParams?.houseOwner === undefined ? '' : `houseOwner=${filterParams?.houseOwner}&`;
    let inSchool: any = filterParams?.inSchool === undefined ? '' : `inSchool=${filterParams?.inSchool}&`;
    let lga: any = filterParams?.lga === undefined ? '' : `lga=${filterParams?.lga}&`;
    let maritalStatus: any = filterParams?.maritalStatus === undefined ? '' : `maritalStatus=${filterParams?.maritalStatus}`;

    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getIncompleteBeneficiaries}?${crimeType}${currentHealthCondition}${educationFunding}${educationLevel}${filterString}${gender}${healthCondition}${houseOwner}${inSchool}${lga}${maritalStatus}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }

  public getAllBeneficiaryProfiles(ssid: any): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getBeneficiaryProfile}/${ssid}`, { headers: this.interceptor?.customHttpHeaders });
  }
  public getAllQualityRatings(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getQualityRating}`, { headers: this.interceptor?.customHttpHeaders });
  }
  public getAllWardList(lga: string): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getWards}${lga}`, { headers: this.interceptor?.customHttpHeaders });
  }
  public getDistanceRanges(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getDistanceRanges}`, { headers: this.interceptor?.customHttpHeaders });
  }

  public getFilteredBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {
   // console.log('completed filterParams>>', filterParams);
    const params: any = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page))
    let crimeType: any = filterParams?.crimeType === undefined ? '' : `crimeType=${filterParams?.crimeType}&`;
    let currentHealthCondition: any =  filterParams?.currentHealthCondition === undefined ? '' : `currentHealthCondition=${filterParams?.currentHealthCondition}&`;
    let educationFunding: any = filterParams?.educationFunding === undefined ? '' : `educationFunding=${filterParams?.educationFunding}&`;
    let educationLevel: any = filterParams?.educationLevel === undefined ? '' : `educationLevel=${filterParams?.educationLevel}&`;
    let filterString: any = filterParams?.filterString === undefined ? '' : `filterString=${filterParams?.filterString}&`;
    let gender: any = filterParams?.gender === undefined ? '' : `gender=${filterParams?.gender}&`;
    let healthCondition: any = filterParams?.healthCondition === undefined ? '' : `healthCondition=${filterParams?.healthCondition}&`;
    let houseOwner: any = filterParams?.houseOwner === undefined ? '' : `houseOwner=${filterParams?.houseOwner}&`;
    let inSchool: any = filterParams?.inSchool === undefined ? '' : `inSchool=${filterParams?.inSchool}&`;
    let lga: any = filterParams?.lga === undefined ? '' : `lga=${filterParams?.lga}&`;
    let maritalStatus: any = filterParams?.maritalStatus === undefined ? '' : `maritalStatus=${filterParams?.maritalStatus}`;

    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getAllBeneficiaries}?${crimeType}${currentHealthCondition}${educationFunding}${educationLevel}${filterString}${gender}${healthCondition}${houseOwner}${inSchool}${lga}${maritalStatus}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }

  

  public getDashboardStats(reportRange: any): Observable<any> {
   // console.log('reportRange>>', reportRange);
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.dashboardStats}?reportRange=${reportRange}`, { headers: this.interceptor?.customHttpHeaders });
  }

  

  //ENUMS

  public getReligionDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.religion}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getEducationDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.education}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getEducationSponsorDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.educationSponsor}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getHealthCondtionsDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.healthConditions}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getHealthAilmentsDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.healthAilments}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getDisabilityTypesDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.disabilityTypes}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getMoneyRangeDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.moneyRange}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  
  public getAideDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.aidType}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getRelationshipDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.relationship}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getEmploymentDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.employment}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getBusinessNatureDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.businessNature}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getDiplomaTypesDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.diplomaTypes}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getCadreTypesDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.cadres}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getTransportDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.transportTypes}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getCriminalTypesDropdown(): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.criminalTypes}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }

  public getReportRanges():Observable<any>{
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.reportRanges}`, { headers: this.interceptor?.customNoAuthHttpHeaders });
  }


}
