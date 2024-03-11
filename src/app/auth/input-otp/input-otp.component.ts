import { Component, OnInit , ElementRef, ViewChild, OnDestroy, Renderer2} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


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


  countdown: number = 60;
  timerSubscription$!: Subscription;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
  console.log("otp value>>>",  this.otpValue);
  this.router.navigate(["/auth/input-new-password"], {relativeTo: this.route});
}



}
