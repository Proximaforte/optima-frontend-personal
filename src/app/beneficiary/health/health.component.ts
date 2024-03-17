import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';


@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {

  options: string[] = [
    "Current health condition*",  "Perfect Health",  "Minor Health Concerns", "Major Health Concerns"
  ]

  ailments: string[] = ["Are you currently suffering from any of the following?*",
    "High Blood Pressure", "Low Blood Pressure", "Diabetes", "Asthma", "Eye Issues", "Ear issues","Others", "None of the above"
  ]

  hmo: string[] = ["Do you have an HMO?*","yes", "no"]

  optionz: string[] = ["Are you currently receiving treatment?*","yes", "no"]

  fundingOptions: string[] = [
    "Source of Funding*", "Parents", "Self-Funded", "Scholarships", "Free Government Support/Subsidized Education"
  ]

  healthForm!:FormGroup;
  showSpecifyAiment: boolean = false;
  showSpecifyHMO: boolean = false;
  disableBtn: boolean = true;

  constructor(
    private router: Router, private route: ActivatedRoute,
  ){}
  

  getHealthForm(){
    this.healthForm = new FormGroup({
      healthCondition: new FormControl('', [Validators.required]),
      healthQuestion: new FormControl('', [Validators.required]),
      specifyAilment: new FormControl('', [Validators.required]),
      HMOQuestion: new FormControl('', [Validators.required]),
      specifyHMO: new FormControl('', [Validators.required]),
      receivingTreatmentQuestion: new FormControl('', [Validators.required]),
      publicHospitalQuestion: new FormControl('', [Validators.required])
    });

    this.healthForm.get('healthQuestion')?.valueChanges.subscribe({
      next: (value:any) => {
        if(value === 'Others'){
          this.showSpecifyAiment = true;
        }else{
          this.showSpecifyAiment = false;
        }
      }
    });

    this.healthForm.get('HMOQuestion')?.valueChanges.subscribe({
      next: (value:any) => {
        if(value === 'yes'){
          this.showSpecifyHMO = true;
        }else{
          this.showSpecifyHMO = false;
        }
      }
    });


    this.healthForm.get('publicHospitalQuestion')?.valueChanges.subscribe({
      next: (value:any) => {
        this.disableBtn = false;
      }
    });
  }

  ngOnInit(): void {
    this.getHealthForm();
  }


  routeToNext(){
   // console.log('form submit>>', this.healthForm.value);
    this.router.navigate(['/home/disability-status'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'disability_status',
        data: JSON.stringify(this.healthForm.value)
      }
    })
  }

}
