import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';


@Component({
  selector: 'app-forgot-passwords',
  templateUrl: './forgot-passwords.component.html',
  styleUrls: ['./forgot-passwords.component.scss']
})
export class ForgotPasswordsComponent implements OnInit {

  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  email:  string = "/assets/images/Avatar.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;

  constructor(
    private router:Router,
    private route: ActivatedRoute
  ){}


ngOnInit(): void {
}



  mapOtpInterface(param: string, value: string){
    this.showOtp = true;
    this.router.navigate(["/auth/otp-identifier"],{  ///auth/input-otp
      relativeTo: this.route,
      queryParams: {
        platformType: param,
        value: value
      }
    })
  }
}
