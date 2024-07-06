import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit, OnDestroy {
  //app-verify-bvn-otp
  ninPlaceHolder: string = '';
  otpValue: string = '';
  disabledBtn: boolean = true;
  countdown: number = 120;
  timerSubscription$!: Subscription;
  showBtn: boolean = false;
  showWelcomeMsg: boolean = false;
  maskedPhoneNumber: string = '';
  showSpinner:boolean = false;
  showVerificationStepper: boolean = false;
  rawPhoneNumber:string | null | any = '';
  showResendOTP:boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiarySerive: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
    const getMessage: any = localStorage.getItem('incomplete');
    if (getMessage !== null) {
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        localStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }

   if(localStorage.getItem('beneficiaryPhoneNumber') !== null){
    let getBeneficiaryNumber: any = localStorage.getItem('beneficiaryPhoneNumber');
    this.rawPhoneNumber = localStorage.getItem('beneficiaryPhoneNumber');
    let maskedPhoneNumber = getBeneficiaryNumber?.replace(/\d(?=\d{4})/g, '*'); // Replace all but the last 4 digits with '*'
    maskedPhoneNumber = maskedPhoneNumber?.slice(0, -2) + getBeneficiaryNumber?.slice(-2);
    this.maskedPhoneNumber = maskedPhoneNumber;
   }
/////////////////////////////////////////////////////////////////////////

  }

  detectClicked() {
    this.ninPlaceHolder = 'Input National Identity Number';
  }
  onInputBlur() {
    this.ninPlaceHolder = '';
  }


  startTimer() {
    this.timerSubscription$ = interval(1000)
      .pipe(
        takeWhile(() => this.countdown > 0)
      )
      .subscribe(() => {
        this.countdown--;
        if (this.countdown === 0) {
          // this.router.navigateByUrl("/home/beneficiary");
          this.showResendOTP = true;
         // this.beneficiarySerive.setRouteToDisplay("personal details");
          // this.router.navigate(["/home/beneficiary"], { relativeTo: this.route, queryParams: { progress: "personal_details" } });
          this.timerSubscription$.unsubscribe(); // Stop the timer

          // this.resendOTP();
          // this.beneficiarySerive.personalDetails(this.beneficiarySerive.getPersonalDetails()).subscribe({
          //   next:(res:any) => {
          //     this.startTimer();
          //     //ome/verification-code?progress=enter_verification_code
          //   }
          // })
        }
      });
  }

  resendOTP(){
    this.showSpinner = true;
    this.beneficiarySerive.generateOTP(this.rawPhoneNumber).subscribe({
      next: (res: any) => {
       //  console.log('OTP resent>>>', res);
       this.countdown = 120;
         this.showSpinner = false;
        this.showResendOTP = false;
        this.startTimer();
      },
      error: (err: any) => {
        console.error("err>>>", err);
        this.showSpinner = false;
      }
    })    
  }

  ngOnInit(): void {
    this.startTimer();

    let checkVerified = localStorage.getItem('verification');
    if(checkVerified === null){
     this.showVerificationStepper = true;
    }else{
     this.showVerificationStepper = false;
    }
  }


  ngOnDestroy(): void {
    // if (this.timerSubscription$) {
    //   this.timerSubscription$.unsubscribe();
    // }
  }

  handleOtpChange(value: string): void {
    // console.log('otp value>>>', value);
    if (value?.length === 6) {
      this.otpValue = value;
      this.disabledBtn = false;
    } else {
      this.disabledBtn = true;
    }
  }


  submit() {
    //console.log("merged>>>", this.otpValue);
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem('beneficiaryPhoneNumber');
    const getNIN: any = localStorage.getItem('nin');
    const parseNIN = JSON.parse(getNIN);
    const OTPPayload:any = {
      nin: parseNIN?.nin,
      type: 'PHONE_NUMBER',
      phoneNumber: getBeneficiaryPhoneNumber,
      image: '',
      otpCode: this.otpValue
    }
    this.beneficiarySerive.verifyNINOTP(OTPPayload).subscribe({
      next: (res: any) => {
       // console.log('res>>>', res);
       this.showSpinner = false;
        this.toast.setSuccessMessage("Phone number is verified successfully!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.router.navigate(["/home/setup-biometrics"], {
          relativeTo: this.route,
          queryParams: {
            progress: "setup_biometrics",
          }
        });
        localStorage.removeItem('verification');
      },
      error: (err: any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
        this.toast.setSuccessMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText);
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      }
    })
  }

}
