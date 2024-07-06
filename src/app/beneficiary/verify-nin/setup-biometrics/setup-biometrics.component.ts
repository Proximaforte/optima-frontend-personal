import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FingerPrintConsent } from './fingerprint-consent.component';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { StateService } from 'src/app/state.service';
import { SkipFingerprintConsentModal } from './onskip-consent.component';
import { SuccesfulBiometricsComponent } from 'src/app/utilities/modals/succesful-biometrics/succesful-biometrics.component';

@Component({
  selector: 'app-setup-biometrics',
  templateUrl: './setup-biometrics.component.html',
  styleUrls: ['./setup-biometrics.component.scss'],
})
export class SetupBiometricsComponent {
  poweredByOptima: string = '/assets/images/powered.svg';
  phone: string = '/assets/images/phone.svg';
  face: string = '/assets/images/face_capture.svg';
  finger: string = '/assets/images/fingerprints.svg';
  marked: string = '/assets/images/marked.svg';
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  urlPath: string = '';
  userDetails: any = '';
  imageCapturePayload: any = {};
  skipThumbprintPayload: any = {};
  showSpinner = false;
  selectedReason: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
    private stateService: StateService

  ) {
    const routePath = this.route.queryParams.subscribe({
      next: (urlPath: Params) => {
        // console.log("urlPath>>>",  this.urlPath);
        this.urlPath = urlPath?.['progress'];
        if (this.urlPath === 'finger_capture_done') {
          this.disabledBtn = false;
        } else if (this.urlPath === 'face_capture_done') {
          this.disabledBtn = false;
        }
      },
    });

    if (sessionStorage.getItem("face_capture")  && this.selectedReason) {
      this.disabledBtn = false
    } else {
      
      this.disabledBtn = true
    }


    const getImageCaptured: any = sessionStorage.getItem('face_capture');
    this.imageCapturePayload = JSON.parse(getImageCaptured);
    //  console.log('image capture>>>', this.imageCapturePayload);

    const getImageSkipThumbprint: any = sessionStorage.getItem(
      'faceCapture_skipThumbPrints',
    );
    this.skipThumbprintPayload = JSON.parse(getImageSkipThumbprint);
    // console.log('skip thumprint image>>>', this.skipThumbprintPayload);
  }

  // const payload = {
  //   nin: this.nin?.nin,
  //   type: 'FACIAL_ID', //PHONE_NUMBER
  //   phoneNumber: getBeneficiaryPhoneNumber,
  //   image: this.photograph?.split(',')[1]
  // }

  // const payload = {
  //   nin: this.nin?.nin,
  //   type: 'FACIAL_ID', //PHONE_NUMBER
  //   phoneNumber: getBeneficiaryPhoneNumber,
  //   image: this.passport?.split(',')[1]
  // }

  procedureInterface(param: string, route: string) {
    // this.showOtp = true;
    this.router.navigate([route], {
      relativeTo: this.route,
      queryParams: {
        progress: param,
      },
    });
    setTimeout(() => location.reload(), 300);
  }

  openFingerPrintModal() {
    const dialogRef = this.dialog.open(FingerPrintConsent, {
      width: '25rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe((selectedReason: string) => {
      if (selectedReason) {
        this.selectedReason = selectedReason;
        this.disabledBtn = false
      }
    });
  }

  proceed() {
    // this.selectedReason = this.stateService.getSelectedReason();
    this.showSpinner = true;
    this.beneficiaryService.Verification(this.imageCapturePayload).subscribe({
      next: (res: any) => {
        // console.log('res>>>', res);
        this.showSpinner = false;
        if(res?.responseCode === 200){
          
           this.dialog.open(SuccesfulBiometricsComponent);
          
        }
      },
      error: (err: any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
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
          this.auth.agentLogout();
        }
      },
    });
  }
}

// /home/setup-biometrics?progress=setup_biometrics
