import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-passwords',
  templateUrl: './forgot-passwords.component.html',
  styleUrls: ['./forgot-passwords.component.scss']
})
export class ForgotPasswordsComponent {

  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  
  constructor(){}



  mapOtpInterface(){
    this.showOtp = true;
  }
}
