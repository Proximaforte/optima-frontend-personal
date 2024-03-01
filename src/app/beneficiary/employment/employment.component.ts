import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    "Do You have a Pension Account?*", "Yes", "No"
  ];
  option4: string[] = [
    "Is your Pension being paid into your Account?*", "Yes", "No"
  ];

  showRetired: boolean = false;
  showSelfEmployed: boolean = false;
  showEmployed: boolean = false;
  employmentForm!: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ) { }


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


  submitForm(){
   // console.log("values>>", this.employmentForm.value);
    this.routeService.setRouteToDisplay("other details");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'other_details'
      }
    })
  }


}
