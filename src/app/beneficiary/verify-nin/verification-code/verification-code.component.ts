import { Component, OnInit , ElementRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {  NgxOtpInputConfig } from 'ngx-otp-input/public-api';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit,AfterViewInit, OnDestroy {

  ninPlaceHolder: string = '';
  otpValue1: any ;
  otpValue2: any ;
  disabledBtn: boolean = true;
  @ViewChild('otpInput') otpInput!: ElementRef | any;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 3,
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
  ){}

  detectClicked(){
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
        this.router.navigateByUrl("/home/beneficiary");
        this.router.navigate(["/home/beneficiary"],{relativeTo: this.route, queryParams:{progress: "verify_NIN"}});
        this.timerSubscription$.unsubscribe(); // Stop the timer
      }
    });
}

  ngOnInit(): void {
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
  if(value?.length === 3){
    this.otpValue1 = value;
  }
}

handleOtpChange2(value: string[]): void {
  // console.log("onChange>>>", value);
 }
 
 handleFillEvent2(value: any): void {
   if(value?.length === 3){
    this.otpValue2 = value;
      this.disabledBtn = false;
   }
 }

 submit(){
  const merged = this.otpValue1.concat(this.otpValue2);
  console.log("merged>>>", Number(merged));
   this.router.navigate(["/home/setup-biometrics"],{relativeTo: this.route, queryParams:{progress: "setup_biometrics"}});
}

}
