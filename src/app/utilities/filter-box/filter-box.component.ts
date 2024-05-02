import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { localGovt } from 'src/app/models/beneficiary/beneficiary';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { PaginationParams } from 'src/app/models/beneficiary/beneficiary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsComponent } from '../toasts/toasts.component';

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit {

  personalDetailsForm!: any;
  filterString: any;
  options: string[] = ["what is your regular means of transportation?*", "Own car", "Public transport", "Okada", "Rail"];
  allLGA: string[] = [];
  button1: string = "/assets/images/Button.svg";
  button2: string = "/assets/images/Button2.svg";
  filterParam!: FormGroup | any;
  paginationParams: PaginationParams = {
    size: 10,
    page: 1
  };

  constructor(
    public dialogRef: MatDialogRef<FilterBoxComponent>,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
  }

  getLGA = localGovt?.map((item: any) => item.localGovt);
  getAllLGA = this.getLGA.flatMap((subArray: any) => subArray);
  filterOptions: any[] = [
    {
      filterBy: 'lga',
      label: 'LOCAL GOVERNMENT AREA (LGA)',
      details: this.getAllLGA
    },
    {
      filterBy: 'gender',
      label: 'GENDER',
      details: ['GENDER', 'MALE', 'FEMALE']
    },
    {
      filterBy: 'houseOwner',
      label: 'HOUSE INFORMATION',
      details: ['HOUSE INFORMATION', "Yes, a house owner", "No, a tenant"]
    },
    {
      filterBy: 'crimeType',
      label: 'CRIME TYPE',
      details: [
        'CRIME TYPE',
        "Theft",
        "Assault",
        "Drug",
        "Fraud",
        "Drug-related offenses",
        "Traffic violation",
        "Others"
      ]
    },
    {
      filterBy: 'maritalStatus',
      label: 'MARITAL STATUS',
      details: [
        'MARITAL STATUS',
        "SINGLE",
        "MARRIED",
        "DIVORCED",
        "WIDOW",
        "WIDOWER"
      ]
    },
    {
      filterBy: 'educationLevel',
      label: 'LEVEL OF EDUCATION',
      details: [
        'LEVEL OF EDUCATION',
        "SSCE",
        "OND",
        "HND",
        "B.Sc",
        "B.Tech",
        "B.Eng",
        "MSc",
        "Phd",
        "None of the above, others"
      ]
    },
    {
      filterBy: 'inSchool',
      label: 'ARE YOU CURRENTLY IN SCHOOL',
      details: ['ARE YOU CURRENTLY IN SCHOOL', 'YES', 'NO']
    },
    {
      filterBy: 'educationFunding',
      label: 'HOW DID YOU FUND YOUR EDUCATION',
      details: [
        'HOW DID YOU FUND YOUR EDUCATION',
        "Parents",
        "Self-Funded",
        "Scholarship",
        "Free Government Support / Subsidized Education"
      ]
    },
    {
      filterBy: 'currentHealthCondition',
      label: 'RATE YOUR CURRENT HEALTH CONDITION',
      details: [
        'RATE YOUR CURRENT HEALTH CONDITION',
        "Perfect Health",
        "Minor Health Concerns",
        "Major Health Concerns"
      ]
    },
    {
      filterBy: 'healthCondition',
      label: 'CURRENT HEALTH CONDITION',
      details: [
        'CURRENT HEALTH CONDITION',
        "High Blood Pressure",
        "Low Blood Pressure",
        "Diabetes",
        "Asthma",
        "Eye Issues",
        "Ear Issues",
        "Heart Issues",
        "Kidney Issues",
        "None of the above, Others"
      ]
    }


  ]

  ngOnInit(): void {
    this.filterParam = new FormGroup({
      filterString: new FormControl(''),
      lga: new FormControl(''),
      gender: new FormControl(''),
      houseOwner: new FormControl(''),
      crimeType: new FormControl(''),
      maritalStatus: new FormControl(''),
      educationLevel: new FormControl(''),
      inSchool: new FormControl(''),
      educationFunding: new FormControl(''),
      currentHealthCondition: new FormControl(''),
      healthCondition: new FormControl(''),
    });
  }

  submit() {
    // console.log('filter params>>>', this.filterParam.value);
    const filterPayload: any = {};

    Object.keys(this.filterParam.getRawValue()).forEach((key: any) => {
      if (this.filterParam.get(key).value) {
        filterPayload[key] = this.filterParam.get(key).value;
      }
    });

    this.beneficiaryService.setBeneficiaryFilter(filterPayload);
   setTimeout(() => {
    this.toast.setSuccessMessage("Data filtered successfully!");
    this.snackbar.openFromComponent(ToastsComponent, {
      duration: 4000,
      verticalPosition: 'bottom',
    });
    this.dialogRef.close();
   }, 400);

  }

  close(): void {
    this.dialogRef.close();
  }

  clearFilter() {
    this.filterParam.reset();
  }


}
