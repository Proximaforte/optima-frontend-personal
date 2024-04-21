import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit , ElementRef, ViewChild, OnDestroy, Renderer2} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';


@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss'],
})
export class InputOTPComponent implements OnInit, OnDestroy{
  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  otpForm!: FormGroup;
  otpValue: string = '';
  routeParams: any = {};
  showSpinner: boolean = false;


  countdown: number = 120;
  timerSubscription$!: Subscription;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
  ){
    const getParams = this.route.queryParams.subscribe({
      next: (param:any) => {
      //  console.log("param123>>>", param);
        this.routeParams = param;
      }
    })
  }


  

otpFormInput(){
  this.otpForm = new FormGroup({
    Otp: new FormControl('')
  })
}

startTimer() {
  this.timerSubscription$ = interval(1000)
    .pipe(
      takeWhile(() => this.countdown > 0)
    )
    .subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigateByUrl("/auth/forgot-paswords");
        this.timerSubscription$.unsubscribe(); // Stop the timer
      }
    });
}

ngOnInit(): void {
  this.otpFormInput();
  this.startTimer();
}


ngOnDestroy(): void {
  if (this.timerSubscription$) {
    this.timerSubscription$.unsubscribe();
  }
}

handleOtpChange(value: string): void {
  if(value?.length === 4){
    this.otpValue = value;
    this.disabledBtn = false;
  }
}



routeToNewPasswords(){
  //console.log("otp value>>>",  this.otpValue);
  this.showSpinner = true;
  this.authService.validateOTP({token: this.otpValue, identifier: this.routeParams?.value}).subscribe({
    next: (res: any) => {
      this.showSpinner = false;
     // console.log('res>>>', res);
      this.toast.setSuccessMessage("Valid OTP input");
      this.router.navigate(["/auth/input-new-password"], 
      {
        relativeTo: this.route,
        queryParams: {
          identifier: this.routeParams?.value
        }
      });
    },
    error: (err: any) => {
      this.showSpinner = false;
      console.error('err123>>>', err?.error?.responseMessage);
      this.toast.setSuccessMessage(err?.error?.responseMessage === "invalid Token" ? 'Invalid OTP input' : err?.error?.responseMessage)
      this.toast.setErrorMessage(err?.error?.responseMessage === "invalid Token" ? 'Invalid OTP input' : err?.error?.responseMessage);
      this.snackbar.openFromComponent(ToastsComponent,{
        duration: 4000,
        verticalPosition: 'bottom',
      });
      // this.router.navigate(["/auth/input-new-password"], 
      // {
      //   relativeTo: this.route,
      //   queryParams: {
      //     identifier: this.routeParams?.value
      //   }
      // });
    }
  })
  //this.router.navigate(["/auth/input-new-password"], {relativeTo: this.route});
}



}
