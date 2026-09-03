
import { Location } from '@angular/common';  // Import Location
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnDestroy, TemplateRef, ViewChild,EventEmitter, Output, HostListener, } from '@angular/core';
import {  Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { ToastsService } from '../services/alert/toasts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, Subscription } from 'rxjs';
import { ConsentCaptureComponent } from '../consent-capture/consent-capture.component';
import {
 
  BeneficiaryProfile,
} from '../models/beneficiary/beneficiary';
import { AuthService } from '../services/authentication/auth.service';
import {
  LivenessFlowService,
  LivenessProvider,
} from '../services/liveness/liveness-flow.service';
import {
  LivenessService,
  RegisterLivenessPayload,
  RegisterLivenessResponse,
} from '../services/liveness/liveness.service';
import {
  LivenessSocketResponse,
  LivenessWebsocketService,
} from '../services/liveness/liveness-websocket.service';
import {
  LivenessVerificationStatusAction,
  LivenessVerificationStatusComponent,
  LivenessVerificationStatusData,
} from '../utilities/modals/liveness-verification-status/liveness-verification-status.component';

type LivenessConsentKey = Exclude<
  keyof RegisterLivenessPayload,
  'livenessReference' | 'channel' | 'nin'
>;

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss'],
})
export class ConsentModalComponent implements OnDestroy {
  @ViewChild('consentModal') consentModal!: TemplateRef<any>;

  @Input() showConsent: boolean = true;
  @Input() warn: string = '';
  @Input() back: string = '';
  @Input() privacy: string = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();
  ninForm!: FormGroup;
  ninPlaceHolder: string = '';
  showBtn: boolean = false;
  routeArray: any = [
    {
      routeToDiaplay: 'verify beneficiary nin',
      queryParam: 'verify_NIN',
    },
    {
      routeToDiaplay: 'personal details',
      queryParam: 'personal_details',
    },
    {
      routeToDiaplay: 'residential details',
      queryParam: 'residential_details',
    },
    {
      routeToDiaplay: 'marital info',
      queryParam: 'marital_info',
    },
    {
      routeToDiaplay: 'education',
      queryParam: 'education',
    },
    {
      routeToDiaplay: 'health',
      queryParam: 'health',
    },
    {
      routeToDiaplay: 'financial',
      queryParam: 'financial',
    },
    {
      routeToDiaplay: 'next of kin',
      queryParam: 'next_of_kin',
    },
    {
      routeToDiaplay: 'employment',
      queryParam: 'employment',
    },
    {
      routeToDiaplay: 'other details',
      queryParam: 'other_details',
    },
  ];
  beneficiaryData: any;

  routeBack: string = '/assets/images/back.svg';

  upload: string = '/assets/images/iconplus.svg';

  photograph: string = '';
  capture: string = '/assets/images/capture.svg';
  disabledBtn: boolean = true;
  acceptImage$!: Subscription;
  webcam: WebcamImage | any = null;
  showWebcam: boolean = false;
  capturedImage: string | any = null;
  trigger: Subject<void> = new Subject<void>();
  triggerObservable: Observable<void> = this.trigger.asObservable();
  showLatest: boolean = false;
  nin: any = {};
  userDetails: any = {};
  isDesktop: boolean = window.innerWidth >= 1024;
  showCapture: boolean = false;
  showPolicy: boolean = false;
  showLoader: boolean = false;
  isLivenessLoading: boolean = false;
  livenessLoadingMessage: string = 'Preparing liveness verification...';
  private activeLivenessReference: string = '';
  private livenessConnectionSubscription?: Subscription;
  private livenessSocketSubscription?: Subscription;
  private livenessBeneficiarySubscription?: Subscription;
  private livenessStatusDialogRef?: MatDialogRef<
    LivenessVerificationStatusComponent,
    LivenessVerificationStatusAction
  >;
  consentItems: {
    key: LivenessConsentKey;
    label: string;
    checked: boolean;
  }[] = [
    {
      key: 'agreeTermsAndConditions',
      label: 'I have read and agree to the Terms and Conditions and Privacy Policy.',
      checked: false,
    },
    {
      key: 'registrationConsent',
      label:
        'I consent to the collection and processing of my personal information for resident/beneficiary registration.',
      checked: false,
    },
    {
      key: 'identityVerificationConsent',
      label:
        'I consent to identity verification, including photo, biometric, and/or liveness checks, to confirm that I am the rightful beneficiary.',
      checked: false,
    },
    {
      key: 'eligibilityAndServiceDeliveryConsent',
      label:
        'I consent to the use of my information for eligibility checks, public service delivery, and beneficiary onboarding.',
      checked: false,
    },
    {
      key: 'informationSharingConsent',
      label:
        'I consent to the sharing of my information with approved government agencies, service providers, and financial institutions, including for bank account opening where applicable.',
      checked: false,
    },
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private authService: AuthService, // Inject Location
    private livenessService: LivenessService,
    private livenessFlowService: LivenessFlowService,
    private livenessWebsocketService: LivenessWebsocketService,
  ) {
    this.getFormValues();
    // this.webcamHeight = window?.innerHeight;
    // this.webcamWidth = window?.innerWidth;

    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    if (localStorage.getItem('NINDetails') !== null) {
      const getNin: any = localStorage.getItem('NINDetails');
      this.nin = JSON.parse(getNin);
    }
  }

  onCancel(): void {
    this.dialog.closeAll();
    this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
  }

  onAccept(): void {
    this.showLivenessNinGate();
    // this.dialog.closeAll();
    // this.router.navigate(['/home/beneficiary'], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     progress: 'verify_NIN',
    //   },
    // });
  }

  get allConsentsAccepted(): boolean {
    return this.consentItems.every((item) => item.checked);
  }

  toggleConsent(index: number): void {
    this.consentItems[index].checked = !this.consentItems[index].checked;
  }

  setConsent(index: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.consentItems[index].checked = checkbox.checked;
  }

  toggleModalContent(content: string): void {
    if (content === 'capture' && !this.allConsentsAccepted) {
      return;
    }

    // Default hide all contents
    this.showPolicy = false;
    this.showConsent = false;
    this.showCapture = false;

    // Show content based on the passed argument
    if (content === 'policy') {
      this.showPolicy = true;
    } else if (content === 'consent') {
      this.showConsent = true;
    } else if (content === 'capture') {
      this.showCapture = true;
    }
  }

  closePrivacyPolicy(): void {
    this.showConsent = true;
    this.dialog.closeAll();
  }

  startLivenessCheck(): void {
    if (!this.allConsentsAccepted || this.isLivenessLoading) {
      return;
    }

    this.ninForm.markAllAsTouched();
    if (this.ninForm.invalid) {
      return;
    }

    const livenessReference = this.buildLivenessReference();
    const nin = this.getLivenessGateNin();
    this.isLivenessLoading = true;
    this.livenessLoadingMessage = 'Preparing liveness verification...';

    this.livenessService
      .registerLiveness(this.buildRegisterLivenessPayload(livenessReference, nin))
      .subscribe({ 
        next: (response: RegisterLivenessResponse) => {
          this.handleRegisterLivenessResponse(response, livenessReference, nin);
        },
        error: (error: unknown) => {
          this.handleLivenessFailure(
            error,
            'Unable to register liveness verification.',
          );
        },
      });
  }

  private launchLivenessProvider(
    registrationResponse: RegisterLivenessResponse,
    fallbackLivenessReference: string,
  ): void {
    const livenessReference =
      registrationResponse?.livenessReference || fallbackLivenessReference;
    const provider = this.livenessFlowService.normaliseBackendProvider(
      registrationResponse.provider,
    );

    if (!provider) {
      this.handleLivenessFailure(
        registrationResponse,
        'Unsupported liveness verification provider.',
      );
      return;
    }

    const context = this.buildLivenessContext(provider, livenessReference);
    this.isLivenessLoading = true;
    this.livenessLoadingMessage =
      'Preparing liveness confirmation channel...';
    this.openLivenessStatusModal({
      status: 'loading',
      title: 'Preparing Verification',
      message: this.livenessLoadingMessage,
    });

    this.livenessConnectionSubscription?.unsubscribe();
    this.livenessConnectionSubscription = this.livenessWebsocketService
      .connect(livenessReference)
      .subscribe({
        next: () => {
          this.waitForLivenessConfirmation(provider, livenessReference);
          this.startLivenessProviderFlow(
            registrationResponse,
            context,
            livenessReference,
          );
        },
        error: (error: unknown) => {
          this.handleLivenessFailure(
            error,
            'Unable to connect to liveness confirmation service.',
          );
        },
      });
  }

  private startLivenessProviderFlow(
    registrationResponse: RegisterLivenessResponse,
    context: ReturnType<ConsentModalComponent['buildLivenessContext']>,
    livenessReference: string,
  ): void {
    void this.livenessFlowService
      .startFromBackend(registrationResponse, context, {
        loading: (isLoading: boolean) => {
          this.isLivenessLoading =
            isLoading || this.activeLivenessReference === livenessReference;

          if (!isLoading && this.activeLivenessReference === livenessReference) {
            this.livenessLoadingMessage =
              'Waiting for your liveness confirmation...';
          }
        },
        success: (selectedProvider: LivenessProvider, response: Record<string, unknown>) => {
          this.handleLivenessProviderCallback(selectedProvider, response);
        },
        closed: (selectedProvider: LivenessProvider, response: Record<string, unknown>) => {
          this.handleLivenessProviderCallback(selectedProvider, response);
        },
        failure: (error: unknown, fallbackMessage: string) => {
          this.handleLivenessFailure(error, fallbackMessage);
        },
      })
      .catch((error: unknown) => {
        this.handleLivenessFailure(
          error,
          'Unable to start liveness verification.',
        );
      });
  }

  private buildLivenessContext(
    provider: LivenessProvider,
    livenessReference: string,
  ) {
    const now = Date.now();
    const user = this.userDetails || {};
    const firstName =
      this.getStringValue(user, ['firstName', 'firstname', 'first_name']) || '';
    const lastName =
      this.getStringValue(user, ['lastName', 'lastname', 'last_name']) || '';
    const phoneNumber =
      this.getStringValue(user, ['phoneNumber', 'phone', 'mobile']) || '';
    const email = this.getStringValue(user, ['email']) || '';
    const ssid = this.getStringValue(user, ['ssid']) || '';

    return {
      provider,
      customerReference: livenessReference,
      sessionId: `consent-${now}`,
      ssid,
      details: {
        firstName,
        lastName,
        phoneNumber,
        email,
      },
    };
  }

  private buildRegisterLivenessPayload(
    livenessReference: string,
    nin: string,
  ): RegisterLivenessPayload {
    return {
      livenessReference,
      channel: 'AGENT',
      nin,
      agreeTermsAndConditions: this.getConsentValue('agreeTermsAndConditions'),
      registrationConsent: this.getConsentValue('registrationConsent'),
      identityVerificationConsent: this.getConsentValue(
        'identityVerificationConsent',
      ),
      eligibilityAndServiceDeliveryConsent: this.getConsentValue(
        'eligibilityAndServiceDeliveryConsent',
      ),
      informationSharingConsent: this.getConsentValue(
        'informationSharingConsent',
      ),
    };
  }

  private buildLivenessReference(): string {
    return `liveness_Agent_${Date.now()}`;
  }

  private getConsentValue(key: LivenessConsentKey): boolean {
    return this.consentItems.find((item) => item.key === key)?.checked ?? false;
  }

  private getStringValue(source: any, keys: string[]): string {
    for (const key of keys) {
      const value = source?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    return '';
  }

  private waitForLivenessConfirmation(
    provider: LivenessProvider,
    livenessReference: string,
  ): void {
    this.livenessSocketSubscription?.unsubscribe();
    this.activeLivenessReference = livenessReference;
    this.livenessLoadingMessage =
      'Waiting for your liveness confirmation...';

    this.livenessSocketSubscription = this.livenessWebsocketService
      .waitForResult(livenessReference)
      .subscribe({
        next: (response: LivenessSocketResponse) => {
          this.handleLivenessSocketResult(provider, response);
        },
        error: (error: unknown) => {
          this.handleLivenessFailure(
            error,
            'Unable to confirm liveness verification.',
          );
        },
      });
  }

  private handleLivenessProviderCallback(
    provider: LivenessProvider,
    response: Record<string, unknown>,
  ): void {
    this.isLivenessLoading = true;
    this.livenessLoadingMessage =
      'Waiting for your liveness confirmation...';
    this.openLivenessStatusModal({
      status: 'loading',
      title: 'Waiting for Verification',
      message: this.livenessLoadingMessage,
    });

    localStorage.setItem(
      'livenessProviderCallback',
      JSON.stringify({
        provider,
        response,
        receivedAt: new Date().toISOString(),
      }),
    );
  }

  private handleLivenessSocketResult(
    provider: LivenessProvider,
    response: LivenessSocketResponse,
  ): void {
    if (response.status?.toUpperCase() === 'SUCCESS') {
      this.handleLivenessSuccessWithBeneficiaryDetails(provider, response);
      return;
    }

    this.handleLivenessFailure(
      response,
      response.message || 'Liveness verification was not successful.',
    );
  }

  private handleLivenessSuccessWithBeneficiaryDetails(
    provider: LivenessProvider,
    response: LivenessSocketResponse,
  ): void {
    const nin = this.getLivenessResponseNin(response);

    if (nin) {
      localStorage.setItem('nin', JSON.stringify(nin));
    }

    this.handleLivenessSuccess(provider, response);
  }

  showLivenessNinGate(): void {
    if (!this.allConsentsAccepted || this.isLivenessLoading) {
      return;
    }

    this.ninForm.enable();
  }

  private getLivenessGateNin(): string {
    return String(this.ninForm.get('nin')?.value || '').replace(/\D/g, '');
  }

  private handleRegisterLivenessResponse(
    registrationResponse: RegisterLivenessResponse,
    fallbackLivenessReference: string,
    nin: string,
  ): void {
    const beneficiary = registrationResponse.registrationDetails;

    if (beneficiary) {
      this.storeVerifiedBeneficiaryDetails(beneficiary.nin || nin, beneficiary);
    }

    if (registrationResponse.consentCaptured && beneficiary) {
      this.isLivenessLoading = false;
      this.clearLivenessRealtimeState();
      this.dialog.closeAll();
      this.continueOnboarding(beneficiary);
      return;
    }

    this.launchLivenessProvider(registrationResponse, fallbackLivenessReference);
  }

  private handleLivenessSuccess(
    provider: LivenessProvider,
    response: LivenessSocketResponse,
  ): void {
    this.isLivenessLoading = false;
    this.clearLivenessRealtimeState();
    localStorage.setItem(
      'livenessVerification',
      JSON.stringify({
        provider,
        response,
        completedAt: new Date().toISOString(),
      }),
    );

    this.openLivenessStatusModal({
      status: 'success',
      title: 'Verification Successful',
      message: response.message,
    });
  }

  private getLivenessResponseNin(response: LivenessSocketResponse): string {
    return this.getStringValue(response, ['nin']).replace(/\D/g, '');
  }

  private storeVerifiedBeneficiaryDetails(
    nin: string,
    response: any,
  ): void {
    const beneficiary = this.beneficiaryService.cacheBeneficiaryPrefill(response);

    this.nin = beneficiary || {};
    this.beneficiaryData = beneficiary;
    localStorage.setItem('nin', JSON.stringify(nin));
  }


  private continueAfterLivenessSuccess(): void {
    this.dialog.closeAll();
    this.beneficiaryService.setRouteToDisplay('personal details');
    this.router.navigate(['/home/beneficiary'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'personal_details',
      },
    });
  }

  private handleLivenessFailure(
    error: unknown,
    fallbackMessage: string,
  ): void {
    this.isLivenessLoading = false;
    this.clearLivenessRealtimeState();
    this.openLivenessStatusModal({
      status: 'error',
      title: 'Verification Failed',
      message: this.getLivenessErrorMessage(error, fallbackMessage),
    });
  }

  private getLivenessErrorMessage(
    error: unknown,
    fallbackMessage: string,
  ): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string' && error) {
      return error;
    }

    if (error && typeof error === 'object') {
      const errorObject = error as Record<string, unknown>;
      const message =
        errorObject['message'] ||
        errorObject['failureReason'] ||
        errorObject['responseMessage'];

      if (typeof message === 'string' && message) {
        return message;
      }
    }

    return fallbackMessage;
  }

  private clearLivenessRealtimeState(): void {
    this.livenessConnectionSubscription?.unsubscribe();
    this.livenessConnectionSubscription = undefined;
    this.livenessSocketSubscription?.unsubscribe();
    this.livenessSocketSubscription = undefined;
    this.livenessBeneficiarySubscription?.unsubscribe();
    this.livenessBeneficiarySubscription = undefined;
    this.livenessWebsocketService.disconnect();
    this.activeLivenessReference = '';
  }

  private openLivenessStatusModal(
    data: LivenessVerificationStatusData,
  ): void {
    if (this.livenessStatusDialogRef) {
      this.livenessStatusDialogRef.componentInstance.updateState(data);
      return;
    }

    const dialogRef = this.dialog.open<
      LivenessVerificationStatusComponent,
      LivenessVerificationStatusData,
      LivenessVerificationStatusAction
    >(LivenessVerificationStatusComponent, {
      data,
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '96vw',
      panelClass: 'liveness-verification-status-panel',
    });

    this.livenessStatusDialogRef = dialogRef;

    dialogRef.afterClosed().subscribe({
      next: (action) => {
        if (this.livenessStatusDialogRef === dialogRef) {
          this.livenessStatusDialogRef = undefined;
        }

        if (action === 'continue') {
          this.continueAfterLivenessSuccess();
          return;
        }

        if (action === 'retry') {
          this.clearLivenessRealtimeState();
          this.isLivenessLoading = false;
          this.startLivenessCheck();
          return;
        }

        if (action === 'cancel') {
          this.clearLivenessRealtimeState();
          this.isLivenessLoading = false;
          this.onCancel();
        }
      },
    });
  }

  detectClicked() {
    this.ninPlaceHolder = 'Input National Identity Number';
  }
  onInputBlur() {
    this.ninPlaceHolder = '';
  }

  onLivenessNinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nin = input.value.replace(/\D/g, '').slice(0, 11);

    if (input.value !== nin) {
      input.value = nin;
      this.ninForm.get('nin')?.setValue(nin);
    }
  }

  getFormValues() {
    this.ninForm = new FormGroup({
      nin: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
    });

    this.ninForm.get('nin')?.valueChanges.subscribe({
      next: (value: string) => {
        if (!this.showCapture) {
          return;
        }

        if (value.length === 11) {
          this.showLoader = true;
          this.beneficiaryService.verifyNIN(value).subscribe({
            next: (response: any) => {


              
              
              
            //  const response =  JSON.parse(this.beneficiaryService.decryptData(response));
              this.showLoader = false;
              if (response?.responseCode === 200) {
                this.toast.setSuccessMessage("Beneficiary's NIN is Valid!");
            

                localStorage.setItem(
                  'beneficiaryPhoneNumber',
                  response?.data?.phone,
                );
                localStorage.setItem(
                  'NINDetails',
                  JSON.stringify(response?.data),
                );

                this.beneficiaryData = response.data;

              //   if (response?.data?.formStage) {
              // this.continueOnboarding(response?.data)

              //             this.dialog.closeAll();
              //   } else {
              //     this.showBtn = true;
              //   }
       this.showBtn = true;
                this.snackbar.openFromComponent(ToastsComponent, {
                  duration: 4000,
                  verticalPosition: 'bottom',
                });
              }
            },
            error: (err: any) => {
              //  console.error('err>>>', err);
              this.showBtn = false;

              
              this.toast.setErrorMessage(
                err?.error?.failureReason ||
                  err?.error?.responseMessage ||
                  err?.statusText,
              );
              this.snackbar.openFromComponent(ToastsComponent, {
                duration: 4000,
                verticalPosition: 'bottom',
              });
              // setTimeout(() => location.reload(), 3000);
            },
          });
        }
      },
    });
  }

  submit() {
    this.beneficiaryService.acceptImageUrl().subscribe({
      next: (item: any) => {
        this.photograph = item?.image;
        this.showLatest = item?.showLatest;
        if (this.showLatest === true) {
          this.disabledBtn = false;
        }
      },
    });

    const value = {
      firstName: this.beneficiaryData.firstName,
      lastName: this.beneficiaryData.lastName,
      image: this.photograph?.split(',')[1],
      nin: this.beneficiaryData.nin,
    };

    localStorage.setItem('nin', JSON.stringify(this.beneficiaryData.nin));

        this.beneficiaryService.consentForm(value).subscribe({

          next: (response: any) => {

            if (
              response?.responseCode === 200 
            ) {
              this.toast.setSuccessMessage("Beneficiary's Consent Submitted! Now Onboard Beneficiary");
              this.dialog.closeAll();

              // localStorage.removeItem("NINDetails")
              // localStorage.removeItem("beneficiaryPhoneNumber")
              // localStorage.removeItem("nin")
              localStorage.removeItem('biometrics');
              localStorage.removeItem('incomplete');
              localStorage.removeItem('verification');
              localStorage.removeItem('faceCapture_skipThumPrints');
              localStorage.removeItem('isFingerprintOk');
              localStorage.removeItem('userAddress');

              // this.beneficiaryService.setRouteToDisplay(
              //   'verify beneficiary nin',
              // );
              // this.router.navigate(['/home/beneficiary'], {
              //   relativeTo: this.route,
              //   queryParams: {
              //     progress: 'verify_NIN',
              //   },
              // });


          // this.router.navigate(['/home/beneficiary'], {
          //   relativeTo: this.route,
          //   queryParams: {
          //     progress: 'verify_NIN',
          //   },
          // });

          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        }
      },
      error: (err: any) => {
        this.toast.setErrorMessage(
          err?.error?.failureReason ||
            err?.error?.responseMessage ||
            err?.statusText,
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if (err?.error?.responseCode === 400) {
          this.dialog.closeAll();

          this.router.navigate(['/home/beneficiary'], {
            relativeTo: this.route,
            queryParams: {
              progress: 'verify_NIN',
            },
          });
        }
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth >= 1024;
  }

  routeToPrevious() {
    window.history.go(-1);
  }

  handleImageCapture(webcamImage: WebcamImage) {
    this.webcam = webcamImage;
  }

  captureImage() {
    this.trigger.next();
    this.beneficiaryService.setImageUrl(this.webcam.imageAsDataUrl);

    this.dialog.open(ConsentCaptureComponent, {
      width: `60%`,
    });
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  ngOnInit(): void {
    this.showLatest = this.beneficiaryService.getShowOriginal();
    this.acceptImage$ = this.beneficiaryService.acceptImageUrl().subscribe({
      next: (item: any) => {
        this.photograph = item?.image;
        this.showLatest = item?.showLatest;
        if (this.showLatest === true) {
          this.disabledBtn = false;
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.acceptImage$?.unsubscribe();
    this.clearLivenessRealtimeState();
  }

  retake() {
    this.showLatest = false;
    this.disabledBtn = true;
  }

  continueOnboarding(beneficiary: BeneficiaryProfile | any) {
    localStorage.removeItem('NINDetails');
    localStorage.removeItem('beneficiaryPhoneNumber');
    localStorage.removeItem('biometrics');
    localStorage.removeItem('incomplete');
    localStorage.removeItem('verification');
    localStorage.removeItem('nin');
    localStorage.removeItem('faceCapture_skipThumPrints');
    localStorage.removeItem('isFingerprintOk');
    localStorage.removeItem('userAddress');
    // this.toast.setSuccessMessage(`Most recent saved stage: ${beneficiary?.formStage}`);
    // this.snackbar.openFromComponent(ToastsComponent, {
    //   duration: 4000,
    //   verticalPosition: 'bottom',
    // });

    this.beneficiaryService.cacheBeneficiaryPrefill(beneficiary);
    localStorage.setItem('userAddress', beneficiary?.address);
    localStorage.setItem(
      'incomplete',
      "Let's continue from where you've stopped!",
    );
    if (beneficiary?.formStage === 'VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('verify beneficiary nin');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verify_NIN',
        },
      });
    } else if (beneficiary?.formStage === 'NIN_VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('personal details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'personal_details',
        },
      });
    } else if (beneficiary?.formStage === 'OTP_VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('biometrics');
      localStorage.setItem('biometrics', 'biometrics');
      this.router.navigate(['/home/setup-biometrics'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'setup_biometrics',
        },
      });
      
    } else if (beneficiary?.formStage === 'PERSONAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('verification procedure');
      localStorage.setItem('verification', 'verification');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verification_procedure',
        },
      });
    } else if (
      beneficiary?.formStage === 'BIO_VERIFICATION' ||
      beneficiary?.formStage === 'VERIFIED'
    ) {
      this.beneficiaryService.setRouteToDisplay('residential details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'residential_details',
        },
      });
    } else if (beneficiary?.formStage === 'ADDRESS_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('marital info');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'marital_info',
        },
      });
    } else if (beneficiary?.formStage === 'MARITAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('education');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'education',
        },
      });
    } else if (beneficiary?.formStage === 'EDUCATION_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('health');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'health',
        },
      });
    } else if (beneficiary?.formStage === 'HEALTH_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('financial');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'financial',
        },
      });
    } else if (beneficiary?.formStage === 'FINANCIAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('next of kin');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'next_of_kin',
        },
      });
    } else if (beneficiary?.formStage === 'NEXT_OF_KIN') {
      this.beneficiaryService.setRouteToDisplay('employment');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'employment',
        },
      });
    } else if (beneficiary?.formStage === 'EMPLOYMENT_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('occupation');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'occupation',
        },
      });
    } else if (beneficiary?.formStage === 'OCCUPATION_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('other details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'other_details',
        },
      });
    } else if (beneficiary?.formStage === 'OTHER_DETAILS') {
      //|| beneficiary?.formStage === "COMPLETED"
      this.beneficiaryService
        .onboardingSubmitted(beneficiary?.phoneNumber)
        ?.subscribe({
          next: (elem: any) => {
            // console.log('res>>', elem);
            this.router.navigate(['/home/dashboard'], {
              relativeTo: this.route,
            });
            this.toast.setSuccessMessage(
              "Beneficiary's onboarding has been completed successfully!",
            );
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
          },
          error: (err: any) => {
            console.error('err>>>', err);
            this.toast.setErrorMessage(
              err?.error?.failureReason ||
                err?.error?.responseMessage ||
                err?.statusText ||
                'Oops an error occured!',
            );
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
            if (err?.status === 401) {
              // this.showSpinner = false;
              this.authService.agentLogout();
            }
          },
        });
    }
  }
}

