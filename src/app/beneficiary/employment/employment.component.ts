import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit {

  options: string[] | any = [
    "Employment status*", "Employed", "Unemployed", "Self-Employed", "Both Employed and Self-employed", "Retired"
  ];
  option2: string[] = [
    "Other Sources of Income e.g farming business etc*"
  ];
  option3: string[] = [
    "Do You have a Pension Account?*", "yes", "no"
  ];
  option4: string[] = [
    "Is your Pension being paid into your Account?*", "yes", "no"
  ];
  option5: string[] | any  = [
    "What is the nature of your business?*"
  ];

  showRetired: boolean = false;
  showSelfEmployed: boolean = false;
  showEmployed: boolean = false;
  employmentForm!: FormGroup;
  userDetails: any = {};
  showSpinner:boolean = false;
  showWelcomeMsg:boolean = false;
  disableBtn: boolean = true;
  showOtherBusiness:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
    const getUserData: any = localStorage.getItem('userDetails');
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

  getDropdownItems(){
    this.beneficiaryService.getEmploymentDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set(["Employment status*", "Employed", "Unemployed", "Self-Employed", "Both Employed and Self-employed", "Retired"].concat(item.data));
      }
    });


    this.beneficiaryService.getBusinessNatureDropdown().subscribe({
      next: (item: any) => {
       // console.log('business nature>>', item);
        this.option5 = new Set(["What is the nature of your business?*"].concat(item.data));
      }
    })
  }


  ngOnInit(): void {
    this.getEmploymentForm();
    this.getDropdownItems();
  }

  getEmploymentForm() {
    this.employmentForm = new FormGroup({
      employmentStatus: new FormControl('', [Validators.required]),
      nameOfEmployer: new FormControl('', [Validators.required]),
      employerOfficeAddress: new FormControl('', [Validators.required]),
      otherSourcesOfIncome: new FormControl('none', [Validators.required]),
      nameOfBusiness: new FormControl('', [Validators.required]),
      natureOfBusiness: new FormControl('', [Validators.required]),
      pensionAccount: new FormControl('', [Validators.required]),
      pensionPaymentQuestion: new FormControl('', [Validators.required]),
      otherBusinessNature: new FormControl('', [Validators.required])
    })

    this.employmentForm.get('employmentStatus')?.valueChanges.subscribe({
      next: (value: any) => {
        this.disableBtn = false;
        if (value === "Employed" || value === "Both Employed and Self-employed") {
          this.showEmployed = true;
          this.showSelfEmployed = false;
          this.showRetired = false;
          this.disableBtn = true;
        } else if (value === "Self-Employed") {
          this.showEmployed = false;
          this.showSelfEmployed = true;
          this.showRetired = false;
          this.disableBtn = true;
        } else if (value === "Retired") {
          this.showEmployed = false;
          this.showSelfEmployed = false;
          this.showRetired = true;
          this.disableBtn = true;
        } else {
          this.showEmployed = false;
          this.showSelfEmployed = false;
          this.showRetired = false;
        }
      }
    })

    this.employmentForm.get('otherSourcesOfIncome')?.valueChanges.subscribe({
      next: (item: any) => {
        if(item?.length > 1){
          this.disableBtn = false;
        }else{
          this.disableBtn = true;
        }
      }
    })

    this.employmentForm.get('otherBusinessNature')?.valueChanges?.subscribe({
      next: (value: string) => {
        if(value?.length > 0){
          this.disableBtn = false;
        }else{
          this.disableBtn = true
        }
      }
    })

    this.employmentForm.get('natureOfBusiness')?.valueChanges.subscribe({
      next: (item: any) => {
        if(item === "Others"){
          this.showOtherBusiness = true;
          this.disableBtn = true;
        }else if(item === "What is the nature of your business?*"){
          this.disableBtn = true;
        }else{
          this.showOtherBusiness = false;
          this.disableBtn = false;
        }

      }
    })


    this.employmentForm.get('pensionPaymentQuestion')?.valueChanges.subscribe({
      next: (item: any) => {
        if(item){
          this.disableBtn = false;
        }else{
          this.disableBtn = true;
        }
      }
    })
  }


  submitForm() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber:any = localStorage.getItem('beneficiaryPhoneNumber');
    const payload: any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      status: this.employmentForm.value?.employmentStatus,
      employer: this.employmentForm.value?.nameOfEmployer,
      employerAddress: this.employmentForm.value?.employerOfficeAddress,
      otherSourceOfIncome: this.employmentForm.value?.otherSourcesOfIncome,
      businessName: this.employmentForm.value?.nameOfBusiness,
      businessNature: this.employmentForm.value?.natureOfBusiness,
      otherBusinessNature: this.employmentForm.value?.natureOfBusiness === "Others" ? this.employmentForm.get('otherBusinessNature')?.value : null,
      hasPensionAccount: this.employmentForm.value?.pensionAccount === 'yes' ? true : this.employmentForm.value?.pensionAccount === 'no' ? false : null
    }

    // console.log("values>>", payload);
    this.beneficiaryService.employmentDetails(payload).subscribe({
      next: (value: any) => {
        this.showSpinner = false;
       // console.log("res>>", value);
        this.toast.setSuccessMessage('Beneficiary Employment data onboarded successfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("occupation");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'occupation'
          }
        })
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error("err from employment details>>", err);
        this.toast.setSuccessMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        
        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      }
    })
  }


}
