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
  pagination: PaginationParams = {
    size: 10,
    page: 1
  }
  params: any;
  personalDetailsObj:any = {}

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
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.onboardingSuccesfull}/${phoneNumber}`, { headers: this.interceptor?.customHttpHeaders });
  }

  public getAllBeneficiaries(paginationParams: PaginationParams): Observable<any> {
    const params = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page));
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getAllBeneficiaries}`, { headers: this.interceptor?.customHttpHeaders, params: params });
  }

  public getAllIncompleteBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {

    const params: any = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page))
    let crimeType: any = filterParams?.crimeType && filterParams.crimeType.length > 0 ? String(filterParams.crimeType) : null
    let currentHealthCondition: any = filterParams?.currentHealthCondition && filterParams.currentHealthCondition.length > 0 ? String(filterParams.currentHealthCondition) : null
    let educationFunding: any = filterParams?.educationFunding && filterParams.educationFunding.length > 0 ? String(filterParams.educationFunding) : null
    let educationLevel: any = filterParams?.educationLevel && filterParams.educationLevel.length > 0 ? String(filterParams.educationLevel) : null
    let filterString: any = filterParams?.filterString && filterParams.filterString.length > 0 ? String(filterParams.filterString) : null
    let gender: any = filterParams?.gender && filterParams.gender.length > 0 ? String(filterParams.gender) : null
    let healthCondition: any = filterParams?.healthCondition && filterParams.healthCondition.length > 0 ? String(filterParams.healthCondition) : null
    let houseOwner: any = filterParams?.houseOwner && filterParams.houseOwner.length > 0 ? String(filterParams.houseOwner) : null
    let inSchool: any = filterParams?.inSchool && filterParams.inSchool.length > 0 ? String(filterParams.inSchool) : null
    let lga: any = filterParams?.lga && filterParams.lga.length > 0 ? String(filterParams.lga) : null
    let maritalStatus: any = filterParams?.maritalStatus && filterParams.maritalStatus.length > 0 ? String(filterParams.maritalStatus) : null

    if (crimeType !== null) {
      params.set('crimeType', crimeType);
    } else if (currentHealthCondition !== null) {
      params.set('currentHealthCondition', currentHealthCondition);
    } else if (educationFunding !== null) {
      params.set('educationFunding', educationFunding);
    } else if (educationLevel !== null) {
      params.set('educationLevel', educationLevel);
    } else if (filterString !== null) {
      params.set('filterString', filterString);
    } else if (gender !== null) {
      params.set('gender', gender);
    } else if (healthCondition !== null) {
      params.set('healthCondition', healthCondition);
    } else if (houseOwner !== null) {
      params.set('houseOwner', houseOwner);
    } else if (inSchool !== null) {
      params.set('inSchool', inSchool);
    } else if (lga !== null) {
      params.set('lga', lga);
    } else if (maritalStatus !== null) {
      params.set('maritalStatus', maritalStatus);
    }
  //  console.log('params>>', params);
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getIncompleteBeneficiaries}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }

  public getAllBeneficiaryProfiles(ssid: any): Observable<any> {
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getBeneficiaryProfile}/${ssid}`, { headers: this.interceptor?.customHttpHeaders });
  }

  public getFilteredBeneficiaries(filterParams: filterParams | any, paginationParams: PaginationParams): Observable<any> {
    const params: any = new HttpParams().set('size', String(paginationParams?.size)).set('page', String(paginationParams?.page))
    let crimeType: any = filterParams?.crimeType && filterParams.crimeType.length > 0 ? String(filterParams.crimeType) : null
    let currentHealthCondition: any = filterParams?.currentHealthCondition && filterParams.currentHealthCondition.length > 0 ? String(filterParams.currentHealthCondition) : null
    let educationFunding: any = filterParams?.educationFunding && filterParams.educationFunding.length > 0 ? String(filterParams.educationFunding) : null
    let educationLevel: any = filterParams?.educationLevel && filterParams.educationLevel.length > 0 ? String(filterParams.educationLevel) : null
    let filterString: any = filterParams?.filterString && filterParams.filterString.length > 0 ? String(filterParams.filterString) : null
    let gender: any = filterParams?.gender && filterParams.gender.length > 0 ? String(filterParams.gender) : null
    let healthCondition: any = filterParams?.healthCondition && filterParams.healthCondition.length > 0 ? String(filterParams.healthCondition) : null
    let houseOwner: any = filterParams?.houseOwner && filterParams.houseOwner.length > 0 ? String(filterParams.houseOwner) : null
    let inSchool: any = filterParams?.inSchool && filterParams.inSchool.length > 0 ? String(filterParams.inSchool) : null
    let lga: any = filterParams?.lga && filterParams.lga.length > 0 ? String(filterParams.lga) : null
    let maritalStatus: any = filterParams?.maritalStatus && filterParams.maritalStatus.length > 0 ? String(filterParams.maritalStatus) : null

    if (crimeType !== null) {
      params.set('crimeType', crimeType);
    } else if (currentHealthCondition !== null) {
      params.set('currentHealthCondition', currentHealthCondition);
    } else if (educationFunding !== null) {
      params.set('educationFunding', educationFunding);
    } else if (educationLevel !== null) {
      params.set('educationLevel', educationLevel);
    } else if (filterString !== null) {
      params.set('filterString', filterString);
    } else if (gender !== null) {
      params.set('gender', gender);
    } else if (healthCondition !== null) {
      params.set('healthCondition', healthCondition);
    } else if (houseOwner !== null) {
      params.set('houseOwner', houseOwner);
    } else if (inSchool !== null) {
      params.set('inSchool', inSchool);
    } else if (lga !== null) {
      params.set('lga', lga);
    } else if (maritalStatus !== null) {
      params.set('maritalStatus', maritalStatus);
    }
    //console.log('params>>', params);
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getAllBeneficiaries}`, {
      headers: this.interceptor?.customHttpHeaders,
      params: params
    });
  }


  public getDashboardStats(reportRange: any): Observable<any> {
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
