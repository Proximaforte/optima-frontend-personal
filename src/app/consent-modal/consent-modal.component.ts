
import { Location } from '@angular/common';  // Import Location
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, TemplateRef, ViewChild,EventEmitter, Output, HostListener, } from '@angular/core';
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
@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss'],
})
export class ConsentModalComponent {
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

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private authService: AuthService, // Inject Location
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
    this.showCapture = true;
    // this.dialog.closeAll();
    // this.router.navigate(['/home/beneficiary'], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     progress: 'verify_NIN',
    //   },
    // });
  }

  toggleModalContent(content: string): void {
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

  detectClicked() {
    this.ninPlaceHolder = 'Input National Identity Number';
  }
  onInputBlur() {
    this.ninPlaceHolder = '';
  }

  getFormValues() {
    this.ninForm = new FormGroup({
      nin: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(10),
        Validators.maxLength(11),
      ]),
    });

    this.ninForm.get('nin')?.valueChanges.subscribe({
      next: (value: string) => {
        if (value.length === 11) {
          this.showLoader = true;
          this.beneficiaryService.verifyNIN(value).subscribe({
            next: (response: any) => {
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

                if (response?.data?.formStage) {
              this.continueOnboarding(response?.data)

                          this.dialog.closeAll();
                } else {
                  this.showBtn = true;
                }

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
              setTimeout(() => location.reload(), 3000);
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
        if (response?.responseCode === 200) {
          this.toast.setSuccessMessage("Beneficiary's Consent Submitted!");
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

          this.beneficiaryService.setRouteToDisplay('verify beneficiary nin');
          this.router.navigate(['/home/beneficiary'], {
            relativeTo: this.route,
            queryParams: {
              progress: 'verify_NIN',
            },
          });

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
    const acceptImage$ = this.beneficiaryService.acceptImageUrl().subscribe({
      next: (item: any) => {
        this.photograph = item?.image;
        this.showLatest = item?.showLatest;
        if (this.showLatest === true) {
          this.disabledBtn = false;
        }
      },
    });
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

    localStorage.setItem('beneficiaryPhoneNumber', beneficiary?.phoneNumber);
    localStorage.setItem('userAddress', beneficiary?.address);
    localStorage.setItem(
      'incomplete',
      "Let's continue from where you've stopped!",
    );
    this.beneficiaryService.verifyNIN(beneficiary?.nin).subscribe({
      next: (details: any) => {
        const stringedData = JSON.stringify(details?.data);
        localStorage.setItem('NINDetails', stringedData);
        // localStorage.setItem('NINDetails', stringedData);
      },
    });

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
      // this.router.navigate(['/home/setup-biometrics'], {
      //   relativeTo: this.route,
      //   queryParams: {
      //     progress: 'finger_capture_done'
      //   }
      // })
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
            this.router.navigate(['/home/all-beneficiary'], {
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
