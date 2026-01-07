import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  emailPlaceHolder: string = '';
  email: string = 'Email';
  options: String[] | any = [
    "Religion*",
    "CHRISTIANITY",
    "ISLAM",
    "OTHERS"
  ];
  personalDetailsForm!: FormGroup;
  showOthers: boolean = false;
  userDetails: any = {};
  showSpinner: boolean = false;
  dateOfBirth: string | any = "";

  showWelcomeMsg: boolean = false;
  disableBtn: boolean = true;
  ninDetails: any = {};
  formattedDate: string = "";
  beneficiaryData: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
    
  ) {
    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    const getMessage: any = localStorage.getItem('incomplete');
    if (getMessage !== null) {
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        localStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }

   if(localStorage.getItem('NINDetails') !== null){
    const getBeneficiaryNin: any = localStorage.getItem('NINDetails');
    this.ninDetails = JSON.parse(getBeneficiaryNin)
   
    
   // var newDate:any = this.ninDetails.birthDate?.split('-');
   // console.log("newDate>>", newDate);
    this.formattedDate = this.ninDetails.birthDate; //`${parseInt(newDate[0], 10)}/${parseInt(newDate[1], 10)}/${newDate[2]}`;
   // console.log("formattedDate>>", this.formattedDate);
   } 
  }


  detectClicked() {
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }
  
  getPersonalForm() {
    this.personalDetailsForm = new FormGroup({
      firstName: new FormControl(this.ninDetails.firstName || this.beneficiaryData?.firstName as string, null),
      lastName: new FormControl(this.ninDetails.lastName || this.beneficiaryData?.lastName as string, null),
      middleName: new FormControl(this.ninDetails.middleName || this.beneficiaryData?.middleName as string, null),
      phoneNumber: new FormControl(this.ninDetails.phoneNumber || this.beneficiaryData?.phoneNumber as string, [Validators.required]),
      bvn: new FormControl('', null),
      email: new FormControl('', null),
      gender: new FormControl(this.ninDetails?.gender || this.beneficiaryData?.gender as string, null),  //this.ninDetails?.gender === 'm' ? 'Male' : this.ninDetails?.gender === 'f' ? 'Female' : null,
      dateOfBirth: new FormControl(this.formattedDate || this.beneficiaryData?.dateOfBirth as string, null),
      placeOfBirth: new FormControl('', [Validators.required]),
      religion: new FormControl('', [Validators.required]),
      others: new FormControl('', this.showOthers ? [Validators.required] : null),
    })


    this.personalDetailsForm.get('religion')?.valueChanges.subscribe((value) => {
      if (value === 'OTHERS') {
        this.showOthers = true;
        this.disableBtn = true;
        this.personalDetailsForm
          .get('others')
          ?.setValidators(Validators.required);
      } else {
        this.showOthers = false;
      }
    })
    // Listen for changes on the entire form
    this.personalDetailsForm.valueChanges.subscribe(() => {
      this.updateDisabledBtn();
    });
  }

  updateDisabledBtn() {
      this.disableBtn = !this.personalDetailsForm.valid;
  }

  getDropDowns(){
    this.beneficiaryService.getReligionDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set(["Religion*","CHRISTIANITY","ISLAM","OTHERS"].concat(item.data));
      }
    })
  }


  ngOnInit(): void {
     this.beneficiaryData = this.beneficiaryService.getBeneficiary();
    this.getPersonalForm();
    this.getDropDowns();
   

   
  }

  submitForm() {
    //var dateObject = new Date(this.ninDetails?.birthDate);


    const getNin: any = localStorage.getItem('NINDetails');
    let newNin: any = JSON.parse(getNin);

    this.showSpinner = true;
    localStorage.setItem('beneficiaryPhoneNumber', this.personalDetailsForm.get('phoneNumber')?.value);
    const payload: any = {
      nin: newNin?.nin,
      // firstname: this.personalDetailsForm.value?.firstName,
      // lastname: this.personalDetailsForm.value?.lastName,
      // middleName: this.personalDetailsForm.value?.middleName,
      phoneNumber: this.personalDetailsForm.get('phoneNumber')?.value,
      bvn: this.personalDetailsForm.value?.bvn ? this.personalDetailsForm.value?.bvn : null,
      email: this.personalDetailsForm.value?.email ? this.personalDetailsForm.value?.email?.toLowerCase() : null,
      // gender: this.personalDetailsForm.value?.gender,
      // dateOfBirth: this.formattedDate,
      placeOfBirth: this.personalDetailsForm.value?.placeOfBirth,
      religion: this.personalDetailsForm.value?.religion,
      otherReligion: this.personalDetailsForm.value?.others ? this.personalDetailsForm.value?.others : null,
    }
 
    this.beneficiaryService.personalDetails(payload).pipe(first()).subscribe({
      next: (res: any) => {
        this.toast.setSuccessMessage('Beneficiary Personal Details is onboarded successfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });

        this.beneficiaryService.setRouteToDisplay("verification procedure");
        this.router.navigate(["/home/verification-code"], {
          relativeTo: this.route,
          queryParams: {
            progress: "enter_verification_code"
          }
        });

        this.beneficiaryService.generateOTP(this.personalDetailsForm.get('phoneNumber')?.value).subscribe({
          next: (res: any) => {
            // console.log('res>>>', res);
          },
          error: (err: any) => {
            console.error("err>>>", err);
          }
        })

      },
      error: (err: any) => {
        this.showSpinner = false;
        // this.toast.setSuccessMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.toast.setErrorMessage(err?.error?.responseMessage ?? err?.statusText ?? "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
          politeness: 'polite'
        });
        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      },
    })
  }

}
