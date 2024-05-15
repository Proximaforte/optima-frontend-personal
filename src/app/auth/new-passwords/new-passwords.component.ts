import { Component, ElementRef,ViewChild,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SuccesfulPasswordsComponent } from 'src/app/utilities/modals/succesful-passwords/succesful-passwords.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-new-passwords',
  templateUrl: './new-passwords.component.html',
  styleUrls: ['./new-passwords.component.scss']
})
export class NewPasswordsComponent implements OnInit {


  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  showOtp: boolean = false;

  showEye: boolean = true;
  showEye_: boolean = true;
  passwordValue: string | any = '';
  passwordPlaceHolder: string = '';
  confirmPasswordPlaceHolder: string = '';
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;
  errorMsg: string = '';
  disabledBtn: boolean = true;
  routeParams: any = {};
  showSpinner: boolean = false;
  showDirectives:boolean = false;
  hasDigit:boolean = false;
  hasLowerCaseLetter:boolean = false;
  hasUpperCaseLetter:boolean = false;
  hasSymbol: boolean = false;
  passwordMatches:boolean = false;
  containsEightCharacters:boolean = false;

  passwordForm!: FormGroup;
  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
  ){
    const routeParam = this.route.queryParams.subscribe({
      next: (param: any) => {
       // console.log('params>>', param);
        this.routeParams = param;
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

  ngOnInit(): void {
    this.passwordInputForm()
  }

  showDirectiveStatments(){
    this.showDirectives = true;
  }

  passwordInputForm(){
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      conFirmPassword: new FormControl('', [Validators.required])
    });

    this.passwordForm.get('password')?.valueChanges.subscribe({
      next: (stringVal: string) => {
        if(stringVal.length === 0){
          this.hasUpperCaseLetter = false;
          this.hasLowerCaseLetter = false;
          this.hasDigit = false;
          this.hasSymbol = false;
        }

         // Validation to check if passwords has at least a length of Eight
        if(stringVal?.length > 7){
          this.containsEightCharacters = true;
        }else if(stringVal?.length < 8){
          this.containsEightCharacters = false;
        }

        // Validation to check if passwords has a digit
        if(stringVal.match(/\d/) !== null){
         // console.log("has string");
          this.hasDigit = true;
        }else{
         // console.log("does not have string");
          this.hasDigit = false;
        }

        // Validation to check if passwords has either a lowercase or uppercase letter
        if(!stringVal?.includes(stringVal?.toLocaleUpperCase()) && stringVal.match(/^[a-z]+$/) !== null){
       //   console.log("has only lowercase letter");
          this.hasLowerCaseLetter = true;
          // this.hasUpperCaseLetter = false;
        }else if(
          stringVal.match(/[a-z]/) !== null && stringVal.match(/[A-Z]/) !== null
          // stringVal?.includes(stringVal?.toLocaleLowerCase())  || stringVal.match(/^[a-z]+$/) !== null
          // || stringVal?.includes(stringVal?.toLocaleUpperCase()) || stringVal.match(/^[A-Z]+$/) !== null
        ){
         // console.log("has both lowercase and uppercase letter");
          this.hasUpperCaseLetter = true;
          this.hasLowerCaseLetter = true;
        }else if(!stringVal?.includes(stringVal?.toLocaleLowerCase()) && stringVal.match(/^[A-Z]+$/) !== null){
        //  console.log("has only uppercase letter");
          this.hasUpperCaseLetter = true;
          // this.hasLowerCaseLetter = false;
        }

          // Validation to check if passwords has a symbol
        if(/[^\w\s]/.test(stringVal)){
          this.hasSymbol = true;
        }else{
          this.hasSymbol = false;
        }

      }
    })

      // Validation to check if passwords === confirmPasswords

    this.passwordForm.get('conFirmPassword')?.valueChanges.subscribe({
      next: (conFirmPassword: string) => {
        const password:FormControl|any = <FormControl>this.passwordForm.get('password')?.value;
        if((conFirmPassword !== password) && (password?.length > 1)){
          this.errorMsg = "*passwords do not match";
         // this.disabledBtn = true;
         this.passwordMatches = false;
       ///  console.log('password not match>>',  this.passwordForm.get('conFirmPassword')?.value);
        }else{
         // console.log('password match>>',  this.passwordForm.get('conFirmPassword')?.value);
          this.errorMsg = "";
          this.passwordMatches = true;
         // this.disabledBtn = false;
         this.validityStateChecker();
        }
      }
    })

  }

  validityStateChecker(){
    if(
      this.hasUpperCaseLetter === true &&
      this.hasLowerCaseLetter === true &&
      this.hasDigit === true &&
      this.hasSymbol === true &&
      this.containsEightCharacters === true &&
      this.passwordMatches === true
    ){
      this.disabledBtn = false;
    }else{
      this.disabledBtn = true;
    }
  }


  togglePasswordVisibility(): void {
    this.showEye = !this.showEye;
    const inputElementVal:HTMLInputElement = this.passwordInput.nativeElement as HTMLInputElement;
    inputElementVal.type = this.showEye ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this. showEye_ = !this. showEye_;
    const inputElementVal:HTMLInputElement = this.confirmPasswordInput.nativeElement as HTMLInputElement;
    inputElementVal.type = this. showEye_ ? 'text' : 'password';
  }

  detectClicked_(){
    this.passwordPlaceHolder = 'Input Password';
  }
  onInputBlur_() {
    this.passwordPlaceHolder = '';
  }

  detectClicked(){
    this.confirmPasswordPlaceHolder = 'Input Confirm Password';
  }
  onInputBlur() {
    this.confirmPasswordPlaceHolder = '';
  }

  submitCorrectData(){
    this.showSpinner = true;
    const payload:any = {
      identifier: this.routeParams?.identifier,
      password: this.passwordForm.get('password')?.value,
      confirmPassword: this.passwordForm.get('conFirmPassword')?.value
    }
   this.authService.resetPassword(payload).subscribe({
    next: (res:any) => {
      this.showSpinner = false;
     // console.log('response>>>', res);
      this.dialog.open(SuccesfulPasswordsComponent,{
        width: '450px',
        height: '310px',
        panelClass: 'custom-container'
     });
    },
    error: (err: any) => {
      this.showSpinner = false;
      console.error('err>>>', err);
      this.toast.setSuccessMessage(err?.error?.failureReason === undefined ? err?.error?.responseMessage : err?.error?.failureReason);
      this.toast.setErrorMessage(err?.error?.failureReason === undefined ? err?.error?.responseMessage : err?.error?.failureReason);
      this.snackbar.openFromComponent(ToastsComponent,{
        duration: 4000,
        verticalPosition: 'bottom',
      });
      if(err?.error?.responseMessage === 'OTP has expired'){
        this.router.navigateByUrl("/auth/forgot-passwords");
      }
    }
   })
  }

}
