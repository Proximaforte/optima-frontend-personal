import { Component, ElementRef,ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit{

  optima: string = "/assets/images/optima.svg";
  kwaraStateLogo: string = "/assets/images/kwara.svg";
  poweredByOptima: string = "/assets/images/powered.svg";
  showEye: boolean = true;

  passwordValue: string | any = '';
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  loginForm!: FormGroup;
  emailPlaceHolder: string = '';
  passwordPlaceHolder: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    console.log("window>>>", window?.location?.search);
  }

  togglePasswordVisibility(): void {
    this.showEye = !this.showEye;
    const inputElementVal:HTMLInputElement = this.passwordInput.nativeElement as HTMLInputElement;
    inputElementVal.type = this.showEye ? 'text' : 'password';
  }

  formInput(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [ 
        Validators.required,
          // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$'), 
        // Validators.minLength(8)
      ])
    });   
  }

  detectClicked(){
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  detectClicked_(){
    this.passwordPlaceHolder = 'Input Password';
  }
  onInputBlur_() {
    this.passwordPlaceHolder = '';
  }


  ngOnInit(): void {
    this.formInput();
  }

  signIn(){
    if(this.loginForm.valid){
      if(window?.location?.search === "?route=user-login"){
        this.router.navigate(['/dashboard/dashboard'], {relativeTo: this.route});
      }else if(window?.location?.search === ""){
        this.router.navigate(['/auth/change-passwords'], {relativeTo: this.route});
      }
    }
  }

  // routeToForgotPasswords(){
  //   this.router.navigate(['/auth/forgot-paswords'], {
  //     relativeTo: this.route
  //   })
  // }
  

}
