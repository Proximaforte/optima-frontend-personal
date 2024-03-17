import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SuccesfulBiometricsComponent } from 'src/app/utilities/modals/succesful-biometrics/succesful-biometrics.component';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-setup-biometrics',
  templateUrl: './setup-biometrics.component.html',
  styleUrls: ['./setup-biometrics.component.scss']
})
export class SetupBiometricsComponent {

  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  face: string = "/assets/images/face_capture.svg";
  finger:string = "/assets/images/fingerprints.svg";
  marked:string = "/assets/images/marked.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  urlPath: string = '';
  userDetails:any = "";
  imageCapturePayload: any = {};
  skipThumbprintPayload:any = {};
  showSpinner = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const routePath = this.route.queryParams.subscribe({
      next: (urlPath: Params ) => {
    // console.log("urlPath>>>",  this.urlPath);
        this.urlPath = urlPath?.['progress'];
        if(this.urlPath === 'finger_capture_done'){
          this.disabledBtn = false;
        }
      }
    });

    const getImageCaptured: any = sessionStorage.getItem('face_capture');
    this.imageCapturePayload = JSON.parse(getImageCaptured);
  //  console.log('image capture>>>', this.imageCapturePayload);

    const getImageSkipThumbprint:any = sessionStorage.getItem('faceCapture_skipThumbPrints');
    this.skipThumbprintPayload = JSON.parse(getImageSkipThumbprint);
   // console.log('skip thumprint image>>>', this.skipThumbprintPayload);
  }

  procedureInterface(param: string, route: string){
    // this.showOtp = true;
    this.router.navigate([route],{
      relativeTo: this.route,
      queryParams: {
        progress: param
      }
    });
  }

  proceed(){
    this.showSpinner = true;
    this.beneficiaryService.Verification( this.imageCapturePayload).subscribe({
      next: (res: any) => {
        console.log('res>>>', res);
        this.showSpinner = false;
        this.dialog.open(SuccesfulBiometricsComponent);
      },
      error: (err: any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
        this.toast.setErrorMessage( err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
            // if(err?.status === 401){
        //   this.auth.agentLogout();
        //   }
      }
    })
  }
}
