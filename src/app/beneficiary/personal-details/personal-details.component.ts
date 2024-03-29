import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  emailPlaceHolder: string = '';
  email: string = 'Email';
  options: String[] = [
    "Religion*",
    "CHRISTIANITY",
    "ISLAM",
    "OTHERS"
  ];
  personalDetailsForm!:FormGroup;
  showOthers: boolean = false;
  userDetails: any = {};
  showSpinner:boolean = false;

  showWelcomeMsg:boolean = false;
  disableBtn:boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

  const getMessage:any = sessionStorage.getItem('incomplete');
  if(getMessage !== null){
    this.showWelcomeMsg = true;
    setTimeout(() => {
      this.showWelcomeMsg = false;
      sessionStorage.removeItem('incomplete');
     }, 2500);
  }else{
     this.showWelcomeMsg = false;
  }

  }

  
  detectClicked(){
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  getPersonalForm(){
    this.personalDetailsForm = new FormGroup({
      firstName: new FormControl(this.userDetails?.firstname, [Validators.required]),
      lastName: new FormControl(this.userDetails?.lastname, [Validators.required]),
      middleName: new FormControl(this.userDetails?.middleName, [Validators.required]),
      phoneNumber: new FormControl(sessionStorage.getItem('beneficiaryPhoneNumber' || null), [Validators.required]),
      bvn: new FormControl('', [Validators.required]),
      email: new FormControl(this.userDetails?.email, [Validators.required]),
      gender: new FormControl(this.userDetails?.gender, [Validators.required]),
      dateOfBirth: new FormControl('Oct 04, 2009', [Validators.required]),
      placeOfBirth: new FormControl('', [Validators.required]),
      religion: new FormControl('', [Validators.required]),
      others: new FormControl(''),
    })

    this.personalDetailsForm.get('religion')?.valueChanges.subscribe({
      next: (value:any) => {
        this.disableBtn = false;
        if(value === 'OTHERS'){
          this.showOthers = true;
        }else{
          this.showOthers = false;
        }
      }
    })
  }

  ngOnInit(): void {
    this.getPersonalForm();
  }

  submitForm(){
    this.showSpinner = true;
   sessionStorage.setItem('beneficiaryPhoneNumber', this.personalDetailsForm.get('phoneNumber')?.value);
    const payload = {
      firstname: this.personalDetailsForm.value?.firstName,
      lastname: this.personalDetailsForm.value?.lastName,
      middleName: this.personalDetailsForm.value?.middleName,
      phoneNumber: this.personalDetailsForm.get('phoneNumber')?.value,
      bvn:  this.personalDetailsForm.value?.bvn,
      email:  this.personalDetailsForm.value?.email,
      gender:  this.personalDetailsForm.value?.gender,
      dateOfBirth:  this.personalDetailsForm.value?.dateOfBirth,
      placeOfBirth:  this.personalDetailsForm.value?.placeOfBirth,
      religion:  this.personalDetailsForm.value.religion === 'OTHERS' ? this.personalDetailsForm.value?.others : this.personalDetailsForm.value?.religion
    }
    this.beneficiaryService.personalDetails(payload).subscribe({
      next: (res: any) => {
    //   console.log("response>>>", res);
        this.toast.setSuccessMessage('Beneficiary Personal Details is onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
  
        this.router.navigate(["/home/verification-code"],{
          relativeTo: this.route, 
          queryParams:{
            progress: "enter_verification_code",
          }});
     
      },
      error: (err:any) => {
        this.showSpinner = false;
        console.error("personal details error>>", err);
        this.toast.setSuccessMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
          politeness: 'polite'
        });
        if(err?.status === 401){
          this.auth.agentLogout();
          }
      }
    })
  }

}
