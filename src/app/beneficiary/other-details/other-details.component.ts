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
  options: string[] | any = ["If yes, for what offence?*", "Theft", "Assault", "Drug", "Fraud", "Drug-related offenses", "Traffic violation", "Others"];
  option2:  string[] | any = ["what is your regular means of transportation?*", "Own car", "Public transport", "Okada", "Rail"];
  option3: string[]|any = ["What is your political view?*","active", "passive"];
  checked1:boolean | any;
  checked2:boolean | any;
  othersForm!: FormGroup;
  showSpecifyCrime: boolean = false;
  userDetails:any = {};
  showSpinner:boolean = false;
  disableBtn: boolean = true;
  showOwnCar: boolean = false;

  showWelcomeMsg:boolean = false;
  constructor(
    private dialog: MatDialog,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    const getMessage:any = localStorage.getItem('incomplete');
    if(getMessage !== null){
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        localStorage.removeItem('incomplete');
       }, 2500);
    }else{
       this.showWelcomeMsg = false;
    }
    
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
      specifyCrimeType: new FormControl('', [Validators.required]),
      crimeDescription: new FormControl('', [Validators.required]),
      transportMeans: new FormControl('', [Validators.required]),
      numberOfCar: new FormControl(null, [Validators.required, Validators.min(1)])
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

    this.othersForm.get('transportMeans')?.valueChanges.subscribe({
      next: (value: any) => {
        if(value === "Own car"){
          this.showOwnCar = true;
          this.disableBtn = true;
        }else{
          this.showOwnCar = false;
          this.disableBtn = false;
        }
      }
    })

    this.othersForm.get('numberOfCar')?.valueChanges.subscribe({
      next: (value: any) => {
        if(value <= 0){
          this.disableBtn = true;
        }else{
          this.disableBtn = false;
        }
      }
    })
  }

  getDropdownItems(){
    this.beneficiaryService.getTransportDropdown().subscribe({
      next: (item: any) => {
        this.option2 = new Set(["what is your regular means of transportation?*", "Own car", "Public transport", "Okada", "Rail"].concat(item.data));
      }
    })


    this.beneficiaryService.getCriminalTypesDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set(["If yes, for what offence?*", "Theft", "Assault", "Drug", "Fraud", "Drug-related offenses", "Traffic violation", "Others"].concat(item.data));
      }
    })
  }

  ngOnInit(): void {
    this.getOthersForm();
  }

  succesfulOboarding(){
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber:any = localStorage.getItem('beneficiaryPhoneNumber');
    const payload = {
      phoneNumber: getBeneficiaryPhoneNumber,
      politicalView: this.othersForm.value?.politicalView,
      convicted: this.checked1,
      crimeType: this.checked1 === true ? this.othersForm.value?.crimeType : null,
      specifyCrimeType: this.othersForm.value?.specifyCrimeType,
      transportMeans: this.othersForm.value?.transportMeans,
      numberOfCar: this.othersForm.value?.numberOfCar,
      crimeDescription: ''
    }

    //console.log('payload>>>', payload);

   this.beneficiaryService.otherDetails(payload).subscribe({
    next: (res: any) => {
     // console.log("res>>>", res);
      this.showSpinner = false;
      this.dialog.open(SuccessfulBeneficiaryOnboardingComponent);
    },
    error: (err: any) => {
      console.error("err>>>", err);
      this.showSpinner = false;
      this.toast.setSuccessMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
      this.toast.setErrorMessage( err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    }
   })
  }


}
