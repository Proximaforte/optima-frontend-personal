import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit, OnDestroy {
//app-verify-bvn-otp
  ninPlaceHolder: string = '';
  otpValue: string = '' ;
  disabledBtn: boolean = true;
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


ngOnDestroy(): void {
  if (this.timerSubscription$) {
    this.timerSubscription$.unsubscribe();
  }
}

handleOtpChange(value: string): void {
  console.log('otp value>>>', value);
  if(value?.length === 6){
    this.otpValue = value;
    this.disabledBtn = false;
  }else{
    this.disabledBtn = true;
  }
}


 submit(){
  console.log("merged>>>", this.otpValue);
   this.router.navigate(["/home/setup-biometrics"],{relativeTo: this.route, queryParams:{progress: "setup_biometrics"}});
}

}
