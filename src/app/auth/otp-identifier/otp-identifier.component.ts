import { HttpResponse } from '@angular/common/http';
import { Component,ElementRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-otp-identifier',
  templateUrl: './otp-identifier.component.html',
  styleUrls: ['./otp-identifier.component.scss']
})
export class OtpIdentifierComponent {

  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  emailPlaceHolder: string = '';
  phonePlaceHolder: string = '';
  showPhone: boolean = false;
  showEmail: boolean = false;
  emailValue: string = '';
  phoneNumberValue: string = '';
  param: any = {};

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private service: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ){
    const getParams = this.route.queryParams.subscribe({
      next: (param:any) => {
       console.log('param>>', param); 
       this.param = param;
        if(param['platformType'] === 'phone'){
          this.showPhone = true;
          this.showEmail = false;
        }else if(param['platformType'] === 'email'){
          this.showEmail = true;
          this.showPhone = false;
        }
      }
    })
  }

  mapOtpInterface(param: string, value: string){
    this.showOtp = true;
    this.router.navigate(["/auth/input-otp"],{
      relativeTo: this.route,
      queryParams: {
        platformType: param,
        value: value
      }
    })
  }

  detectClicked(){
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  detectPhoneClicked(){
    this.phonePlaceHolder = 'Input phone number'
  }

  onInputPhoneBlur() {
    this.phonePlaceHolder = '';
  }

  handlePhoneNumberChange(event: any){
    if(event?.length > 10){
      this.disabledBtn = false;
    }
  }

  handleEmailChange(event:any){
    if(event?.includes('@')){
      this.disabledBtn = false;
    }
  }

  submitData(){
    if(this.phoneNumberValue?.length === 0){
      // console.log('email>>', this.emailValue);
      
      this.service.forgotPasswords({identifier: this.emailValue}).subscribe({
        next: (res: any) => {
          console.log('phone number identifier response>>>>', res);
          this.router.navigate(["/auth/input-otp"],{
            relativeTo: this.route,
            queryParams: {
              platformType: this.param.platformType,
              value: this.param.value
            }
          })
        },
        error: (err:any) => {
          console.error(' email Http Error>>', err);
          this.toast.setErrorMessage(err?.error?.failureReason);
          this.snackbar.openFromComponent(ToastsComponent,{
            duration: 4000,
            verticalPosition: 'bottom',
          });
        }
      })
    }else if(this.emailValue?.length === 0){
      // console.log('phone number>>', this.phoneNumberValue);
    
      this.service.forgotPasswords({identifier: this.phoneNumberValue}).subscribe({
        next: (res: any) => {
          console.log('phone number identifier response>>>>', res);
          this.router.navigate(["/auth/input-otp"],{
            relativeTo: this.route,
            queryParams: {
              platformType: this.param.platformType,
              value: this.param.value
            }
          })
    
        },
        error: (err:any) => {
          console.error('phone number Http Error>>', err);
          this.toast.setErrorMessage(err?.error?.failureReason);
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        }
      })
    }

  }

}
