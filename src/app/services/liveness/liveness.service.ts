import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { JwtInterceptorService } from '../authentication/interceptor/jwt-interceptor.service';

export interface RegisterLivenessPayload {
  livenessReference: string;
  channel: "WEB" | "AGENT";
  agreeTermsAndConditions: boolean;
  registrationConsent: boolean;
  identityVerificationConsent: boolean;
  eligibilityAndServiceDeliveryConsent: boolean;
  informationSharingConsent: boolean;
  nin: string;
}

export interface RegisterLivenessResponse {
  livenessReference: string;
  provider: 'DOJAH' | 'VERIFYME' | 'QOREID';
  subscriptionTopic?: string | null;
  consentCaptured?: boolean;
  message?: string;
  registrationDetails?: {
    nin?: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    middleName?: string;
    gender?: string;
    progressCount?: number;
    currentStage?: string;
    nextStage?: string;
    formStage?: string;
    registrationType?: string;
    biometricMatch?: boolean;
    imageUrl?: string;
    fingerprintCaptured?: boolean;
    phoneNumber?: string;
    dateOfBirth?: string;
    placeOfBirth?: string | null;
    stateOfOrigin?: string | null;
    lga?: string | null;
  } | null;
  token?: string;
  sessionToken?: string;
  qoreIdSessionToken?: string;
}

export interface LivenessStatusResponse {
  status: string;
  message: string;
  originalCorrelationId: string;
}

@Injectable({
  providedIn: 'root',
})
export class LivenessService {
  constructor(
    private http: HttpClient,
    private interceptor: JwtInterceptorService,
  ) {}

  public registerLiveness(
    payload: RegisterLivenessPayload,
  ): Observable<RegisterLivenessResponse> {
    const body = JSON.stringify(payload);

    return this.http.post<RegisterLivenessResponse>(
      `${environment?.baseUrl}/${endpoints?.registerLiveness}`,
      body,
      { headers: this.interceptor?.customHttpHeaders },
    );
  }

  public getLivenessStatus(
    livenessReference: string,
  ): Observable<LivenessStatusResponse> {
    return this.http.get<LivenessStatusResponse>(
      `${environment?.baseUrl}/${endpoints?.getLiveness}/${encodeURIComponent(
        livenessReference,
      )}`,
      { headers: this.interceptor?.customHttpHeaders },
    );
  }
}
