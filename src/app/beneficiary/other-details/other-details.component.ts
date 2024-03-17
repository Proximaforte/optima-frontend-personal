import { Component, OnInit } from '@angular/core';
import { SuccessfulBeneficiaryOnboardingComponent } from 'src/app/utilities/modals/successful-beneficiary-onboarding/successful-beneficiary-onboarding.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
  options: string[] = ["If yes, for what offence?*", "Theft", "Assault", "Drug", "Drug-related Offenses", "Traffic violation", "Others"];
  option2:  string[] = ["what is your regular means of transportation?*", "Own car", "Public transport", "Okada", "Rail"];
  checked1:boolean | any;
  checked2:boolean | any;
  othersForm!: FormGroup;
  showSpecifyCrime: boolean = false;
  userDetails:any = {};
  showSpinner:boolean = false;
  constructor(
    private dialog: MatDialog,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);
  }


  detectTouched(radioType: string){
    if(radioType === 'radio1'){
      this.checked2 = false;
      this.checked1 = true;
    }else if(radioType === 'radio2'){
      this.checked1 = false;
      this.checked2 = true;
    }
  }

 

  getOthersForm(){
    this.othersForm = new FormGroup({
      politicalView: new FormControl('', [Validators.required]),
      crimeType: new FormControl('', [Validators.required]),
      crimeDescription: new FormControl('', [Validators.required]),
      transportMeans: new FormControl('', [Validators.required]),
      numberOfCar: new FormControl('', [Validators.required])
    })

    this.othersForm.get('crimeType')?.valueChanges.subscribe({
      next: (value: any) => {
        if(value === "Others"){
          this.showSpecifyCrime = true;
        }else{
          this.showSpecifyCrime = false;
        }
      }
    })
  }

  ngOnInit(): void {
    this.getOthersForm();
  }

  succesfulOboarding(){
    this.showSpinner = true;
    const payload = {
      phoneNumber: this.userDetails?.phoneNumber,
      politicalView: this.othersForm.value?.politicalView,
      convicted: this.checked1,
      crimeType: this.othersForm.value?.crimeType,
      crimeDescription: this.othersForm.value?.crimeDescription,
      transportMeans: this.othersForm.value?.transportMeans,
      numberOfCar: this.othersForm.value?.numberOfCar 
    }

  //  console.log('payload>>', payload);
   // this.dialog.open(SuccessfulBeneficiaryOnboardingComponent);
   this.beneficiaryService.otherDetails(payload).subscribe({
    next: (res: any) => {
      console.log("res>>>", res);
      this.showSpinner = false;
      this.dialog.open(SuccessfulBeneficiaryOnboardingComponent);
    },
    error: (err: any) => {
      console.error("err>>>", err);
      this.showSpinner = false;
      this.toast.setErrorMessage( err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    }
   })
  }


}
