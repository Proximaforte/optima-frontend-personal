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
    "Others"
  ];
  personalDetailsForm!:FormGroup;
  showOthers: boolean = false;
  userDetails: any = {};
  showSpinner:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
   // console.log('user data>>', JSON.parse(getUserData));
    this.userDetails = JSON.parse(getUserData);
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
      phoneNumber: new FormControl(this.userDetails?.phoneNumber, [Validators.required]),
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
        if(value === 'Others'){
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
   if(this.personalDetailsForm?.valid){
    this.showSpinner = true;
   // console.log("form values>>", this.personalDetailsForm.value);
    const payload = {
      firstname: this.personalDetailsForm.value?.firstName,
      lastname: this.personalDetailsForm.value?.lastName,
      middleName: this.personalDetailsForm.value?.middleName,
      phoneNumber: this.personalDetailsForm.value?.phoneNumber,
      bvn:  this.personalDetailsForm.value?.bvn,
      email:  this.personalDetailsForm.value?.email,
      gender:  this.personalDetailsForm.value?.gender,
      dateOfBirth:  this.personalDetailsForm.value?.dateOfBirth,
      placeOfBirth:  this.personalDetailsForm.value?.placeOfBirth,
      religion:  this.personalDetailsForm.value.religion === 'Others' ? this.personalDetailsForm.value?.others : this.personalDetailsForm.value?.religion
    }
    this.beneficiaryService.personalDetails(payload).subscribe({
      next: (res: any) => {
       // console.log("response>>>", res);
        this.toast.setSuccessMessage('Beneficiary Personal Details is onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("residential details");
        this.router.navigate(['/home/beneficiary'],{
          relativeTo: this.route,
          queryParams: {
            progress: 'residential_details'
          }
        })
      },
      error: (err:any) => {
        this.showSpinner = false;
        console.error("personal details error>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        // if(err?.status === 401){
        //   this.auth.agentLogout();
        //   }
      }
    })
   }
  }

}
