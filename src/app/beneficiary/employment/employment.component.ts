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

  options: string[] = [
    "Emploment status*", "Employed", "Unemployed", "Self-Employed", "Both Employed and Self-Employed", "Retired"
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

  showRetired: boolean = false;
  showSelfEmployed: boolean = false;
  showEmployed: boolean = false;
  employmentForm!: FormGroup;
  userDetails: any = {};
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
  }


  ngOnInit(): void {
    this.getEmploymentForm();
  }

  getEmploymentForm() {
    this.employmentForm = new FormGroup({
      employmentStatus: new FormControl('', [Validators.required]),
      nameOfEmployer: new FormControl('', [Validators.required]),
      employerOfficeAddress: new FormControl('', [Validators.required]),
      otherSourcesOfIncome: new FormControl('', [Validators.required]),
      nameOfBusiness: new FormControl('', [Validators.required]),
      natureOfBusiness: new FormControl('', [Validators.required]),
      pensionAccount: new FormControl('', [Validators.required]),
      pensionPaymentQuestion: new FormControl('', [Validators.required])
    })

    this.employmentForm.get('employmentStatus')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === "Employed") {
          this.showEmployed = true;
          this.showSelfEmployed = false;
          this.showRetired = false;
        } else if (value === "Self-Employed") {
          this.showEmployed = false;
          this.showSelfEmployed = true;
          this.showRetired = false;
        } else if (value === "Retired") {
          this.showEmployed = false;
          this.showSelfEmployed = false;
          this.showRetired = true;
        } else {
          this.showEmployed = false;
          this.showSelfEmployed = false;
          this.showRetired = false;
        }
      }
    })
  }


  submitForm() {
    const payload: any = {
      phoneNumber: this.userDetails?.phoneNumber,
      status: this.employmentForm.value?.employmentStatus,
      employer: this.employmentForm.value?.nameOfEmployer,
      employerAddress: this.employmentForm.value?.employerOfficeAddress,
      otherSourceOfIncome: this.employmentForm.value?.otherSourcesOfIncome,
      businessName: this.employmentForm.value?.nameOfBusiness,
      businessNature: this.employmentForm.value?.natureOfBusiness,
      hasPensionAccount: this.employmentForm.value?.pensionAccount === 'yes' ? true : this.employmentForm.value?.pensionAccount === 'no' ? false : null
    }

    // console.log("values>>", payload);
    this.beneficiaryService.employmentDetails(payload).subscribe({
      next: (value: any) => {
        console.log("res>>", value);
        this.toast.setSuccessMessage('Beneficiary Employment data onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("other details");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'other_details'
          }
        })
      },
      error: (err: any) => {
        console.error("err from employment details>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });

        // if (err?.status === 401) {
        //   this.auth.agentLogout();
        // }
      }
    })
  }


}
