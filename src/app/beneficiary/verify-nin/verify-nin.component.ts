import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-verify-nin',
  templateUrl: './verify-nin.component.html',
  styleUrls: ['./verify-nin.component.scss']
})
export class VerifyNINComponent implements OnInit {

  ninPlaceHolder: string = '';
  ninForm!: FormGroup;
  showBtn: boolean = false;
  showWelcomeMsg: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
    const getDetails: any = localStorage.getItem('userDetails');
    const getMessage: any = sessionStorage.getItem('incomplete');
    if (getMessage !== null) {
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        sessionStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }

  }

  detectClicked() {
    this.ninPlaceHolder = 'Input National Identity Number';
  }
  onInputBlur() {
    this.ninPlaceHolder = '';
  }

  ngOnInit(): void {
    this.getFormValues();
  }

  getFormValues() {
    this.ninForm = new FormGroup({
      nin: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(11)])
    })

    this.ninForm.get('nin')?.valueChanges.subscribe({
      next: (value: string) => {
       // console.log('NIN value>>', value)
       if (value.length === 11) {
        this.showBtn = true;
          this.beneficiaryService.verifyNIN(value).subscribe({
            next: (response: any) => {
              if (response?.responseCode === 200) {
                sessionStorage.setItem('beneficiaryPhoneNumber', response?.data?.phone);
                this.toast.setSuccessMessage("Beneficiary's NIN has been verified successfully!");
                this.snackbar.openFromComponent(ToastsComponent, {
                  duration: 4000,
                  verticalPosition: 'bottom',
                });
              }
            },
            error: (err: any) => {
              //  console.error('err>>>', err);
              this.showBtn = false;
              this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText);
              this.snackbar.openFromComponent(ToastsComponent, {
                duration: 4000,
                verticalPosition: 'bottom',
              })
              setTimeout(() => location.reload(), 3000);
            }
          })
       }


      }
    })
  }

  submit() {
    this.beneficiaryService.setRouteToDisplay("personal details");
    this.router.navigate(["/home/beneficiary"], {
      relativeTo: this.route,
      queryParams: {
        progress: "personal_details",
      }
    });
    // this.router.navigate(["/home/verification-code"],{
    //   relativeTo: this.route, 
    //   queryParams:{
    //     progress: "enter_verification_code",
    //   }});
    //personal_details

    sessionStorage.setItem('nin', JSON.stringify(this.ninForm.value));
  }

}
