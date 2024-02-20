import { Component, ElementRef,ViewChild,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordComponent } from 'src/app/utilities/modals/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-change-passwords',
  templateUrl: './change-passwords.component.html',
  styleUrls: ['./change-passwords.component.scss']
})
export class ChangePasswordsComponent implements OnInit {
  optima:string = "/assets/images/optima.svg";
  kwaraStateLogo: string = "/assets/images/kwara.svg";
  poweredByOptima: string = "/assets/images/powered.svg";

  showEye: boolean = true;
  showEye_: boolean = true;
  passwordValue: string | any = '';
  passwordPlaceHolder: string = '';
  confirmPasswordPlaceHolder: string = '';
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;
  errorMsg: string = '';
  disabledBtn: boolean = true;

  passwordForm!: FormGroup;
  constructor(
    private dialog: MatDialog
  ){
  }

  passwordInputForm(){
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      conFirmPassword: new FormControl('', [Validators.required])
    });

    this.passwordForm.get('conFirmPassword')?.valueChanges.subscribe({
      next: (conFirmPassword: string) => {
        const password:FormControl|any = <FormControl>this.passwordForm.get('password')?.value;
        if(conFirmPassword !== password && password?.length > 1){
          this.errorMsg = "*passwords do not match";
          this.disabledBtn = true;
        }else{
          this.errorMsg = "";
          this.disabledBtn = false;
        }
      }
    })
  }





  ngOnInit(): void {
    this.passwordInputForm()
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
    this.dialog.open(ChangePasswordComponent,{
       width: '450px',
       height: '300px',
       panelClass: 'custom-container'
    });
  }

  

}
