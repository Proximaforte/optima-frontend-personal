import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { authGuard } from '../securities/auth/auth.guard';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  optima: string = "/assets/images/Optima_.svg";
  kwaraStateLogo: string = "/assets/images/coatOfArms.svg"; // "/assets/images/arms.svg"
  poweredByOptima: string = "/assets/images/optimus.svg";
  showEye: boolean = true;
  showSpinner: boolean = false;

  passwordValue: string | any = '';
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  loginForm!: FormGroup;
  emailPlaceHolder: string = '';
  passwordPlaceHolder: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authGuard: authGuard,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ) {
    //  console.log("window>>>", window?.location?.search);
  }

  togglePasswordVisibility(): void {
    this.showEye = !this.showEye;
    const inputElementVal: HTMLInputElement = this.passwordInput.nativeElement as HTMLInputElement;
    inputElementVal.type = this.showEye ? 'text' : 'password';
  }

  formInput() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$'),
        // Validators.minLength(8)
      ])
    });
  }

  detectClicked() {
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  detectClicked_() {
    this.passwordPlaceHolder = 'Input Password';
  }
  onInputBlur_() {
    this.passwordPlaceHolder = '';
  }

  agentLogoutBeforeLeaving() {
    if (
      this.authService.agentIsLoggedIn() && !this.authGuard.canActivate == false
    ) {
      this.router.navigate(['/home/dashboard'], { relativeTo: this.route }); //current route supposed normally

    }
  }

  getBrowserEye(){
    const getNav: any = window?.navigator;
    const brandsArray: [] = getNav?.userAgentData?.brands;
   // console.log("brands>>>", brandsArray);
    const filterBrowserType = brandsArray?.forEach((elem: any) => {
      if (elem?.brand === 'Microsoft Edge') {
        this.showEye = false;
       // console.log("Browser Type>>", elem?.brand);
      }
    })
  }



  ngOnInit(): void {
    this.getBrowserEye();
    this.formInput();
    this.agentLogoutBeforeLeaving();
  }

  //email: judeomosehin@gmail.com,  passwords: Password123@


  signIn() {
    this.showSpinner = true;
    if (this.loginForm.valid) {
      this.authService.loginAgendData(this.loginForm.value).subscribe({
        next: (details: any) => {
         // console.log("login response details>>>", details);
          this.showSpinner = false;
          if (details?.token) {
           try{
            this.authService.setAgentToken(details?.token);
            this.router.navigate(['/home/dashboard'], { relativeTo: this.route }).then(() => location?.reload());
            this.toast.setSuccessMessage('User is logged In Successfully');
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
           }catch(err:any){
            console.error('err>>>', err);
           }
          } else {
            this.router.navigate(['/auth/change-passwords'], { relativeTo: this.route });
          }
        },
        error: (err: any) => {
          console.error("error>>>", err);
          this.showSpinner = false;
          this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        }
      })
      // if (window?.location?.search === "?route=user-login") {
      //   // this.router.navigate(['/home/dashboard'], {relativeTo: this.route});
      // } else if (window?.location?.search === "") {
      //   this.router.navigate(['/auth/change-passwords'], { relativeTo: this.route });
      // }
    }
  }

  // routeToForgotPasswords(){
  //   this.router.navigate(['/auth/forgot-paswords'], {
  //     relativeTo: this.route
  //   })
  // }


}
