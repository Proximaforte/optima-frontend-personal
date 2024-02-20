import { Component, OnInit , ElementRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {  NgxOtpInputConfig } from 'ngx-otp-input/public-api';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss']
})
export class InputOTPComponent implements OnInit, AfterViewInit, OnDestroy{
  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  otpForm!: FormGroup;
  otpValue: any;
  routeParams: any = {};
  @ViewChild('otpInput') otpInput!: ElementRef | any;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: false,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    }
  }

  countdown: number = 60;
  timerSubscription$!: Subscription;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){
    const getParams = this.route.queryParams.subscribe({
      next: (param:any) => {
        // console.log("param>>>", param);
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

ngAfterViewInit(): void {
  this.otpInput.nativeElement.classList.add('large-otp-input');
}

ngOnDestroy(): void {
  if (this.timerSubscription$) {
    this.timerSubscription$.unsubscribe();
  }
}

handleOtpChange(value: string[]): void {
 // console.log("onChange>>>", value);
}

handleFillEvent(value: any): void {
  if(value?.length === 4){
    this.disabledBtn = false;
  }
}

routeToNewPasswords(){
  this.router.navigate(["/auth/input-new-password"], {relativeTo: this.route});
}



}
