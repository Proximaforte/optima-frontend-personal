import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';


@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})

export class HealthComponent implements OnInit {

  options: string[] | any  = [
    "Current health condition*",  "Perfect Health",  "Minor Health Concerns", "Major Health Concerns"
  ]

  ailments: string[] | any = ["Are you currently suffering from any of the following?*","High Blood Pressure", "Low Blood Pressure", "Diabetes", "Asthma", "Eye Issues", "Ear Issues","Heart Issues", "Kidney Issues","Others", "None of the above, Others"
  ]

  hmo: string[] | any = ["Do you have an health insurance?","yes", "no"]

  optionz: string[] | any = ["Are you currently receiving treatment?*","yes", "no"]

  optiond: string[] | any = ["Do you have access to a healthcare facility within a reasonable distance?","yes","no"]

  optiondis: string[] | any = ["How far is the nearest healthcare facility from your home?","Less than 1km","1km - 5km","5km - 10km","10km - 20km","Greater than 20km"]


  healthForm!:FormGroup;
  showSpecifyAiment: boolean = false;
  showSpecifyHMO: boolean = false;
  showSpecifyHospital: boolean = false;
  disableBtn: boolean = true;
  distanceRanges: string[] = ["How far is the nearest healthcare facility from your home?*"]
  showWelcomeMsg:boolean = false;

  constructor(
    private router: Router, private route: ActivatedRoute, private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
  ){
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
  

  getHealthForm(){
    this.healthForm = new FormGroup({
      healthCondition: new FormControl('', [Validators.required]),
      healthQuestion: new FormControl('', [Validators.required]),
      specifyAilment: new FormControl('', null),
      HMOQuestion: new FormControl('', [Validators.required]),
      specifyHMO: new FormControl('', null),
      receivingTreatmentQuestion: new FormControl('', [Validators.required]),
      access_to_healthcare: new FormControl('', [Validators.required]),
      distance_to_healthcare: new FormControl('', [Validators.required]),
      household_health_issues: new FormControl('', [Validators.required]),
      publicHospitalQuestion: new FormControl('', null)
    });

   this.healthForm.get('healthQuestion')?.valueChanges.subscribe({
     next: (value: any) => {
       const specifyAilmentControl = this.healthForm.get('specifyAilment');

       if (value === 'Others') {
         this.showSpecifyAiment = true;
         specifyAilmentControl?.setValidators(Validators.required);
       } else {
         this.showSpecifyAiment = false;
         specifyAilmentControl?.clearValidators();
       }

       specifyAilmentControl?.updateValueAndValidity();
     },
   });


   this.healthForm.get('receivingTreatmentQuestion')?.valueChanges.subscribe({
     next: (value: any) => {
       const publicHospitalControl = this.healthForm.get(
         'publicHospitalQuestion',
       );

       if (value === 'yes') {
         this.showSpecifyHospital = true;
         publicHospitalControl?.setValidators(Validators.required);
       } else {
         this.showSpecifyHospital = false;
         publicHospitalControl?.clearValidators();
       }

       publicHospitalControl?.updateValueAndValidity();
     },
   });


  this.healthForm.get('HMOQuestion')?.valueChanges.subscribe({
    next: (value: any) => {
      const specifyHMOControl = this.healthForm.get('specifyHMO');

      if (value?.toLowerCase() === 'yes') {
        this.showSpecifyHMO = true;
        specifyHMOControl?.setValidators(Validators.required);
      } else {
        this.showSpecifyHMO = false;
        specifyHMOControl?.clearValidators();
      }

      specifyHMOControl?.updateValueAndValidity();
    },
  });


  }

  updateDisabledBtn() {
    this.disableBtn = !this.healthForm.valid;
  }
// kk
  getDistanceRanges() {
    this.beneficiaryService.getDistanceRanges().subscribe({
      next: (data: any) => {
        this.distanceRanges = Array.isArray(data?.data)
          ? ['How far is the nearest healthcare facility from your home?*', ...data?.data]
          : [];
      },
      error: (err: any) => {
        this.toast.setErrorMessage(
          err?.error?.failureReason ||
            err?.error?.responseMessage ||
            err?.statusText ||
            'Oops an error occured!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      },
    });
  }
  getHealthConditions(){
    this.beneficiaryService.getHealthCondtionsDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set([ "Current health condition*",  "Perfect Health",  "Minor Health Concerns", "Major Health Concerns"].concat(item.data));
      }
    })


    this.beneficiaryService.getHealthAilmentsDropdown().subscribe({
      next: (item: any) => {
        this.ailments = new Set(["Are you currently suffering from any of the following?*"].concat(item.data));
      }
    })
  }

  ngOnInit(): void {
    this.getHealthForm();
    this.getHealthConditions();
    this.getDistanceRanges();

    this.healthForm.valueChanges.subscribe(() =>
      this.updateDisabledBtn(),
    );
  }


  routeToNext(){
   // console.log('Health form submit>>', this.healthForm.value);
    this.router.navigate(['/home/disability-status'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'disability_status',
        data: JSON.stringify(this.healthForm.value)
      }
    })
  }

}
