import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    "Christan",
    "Muslim",
    "Others"
  ];
  personalDetailsForm!:FormGroup;
  showOthers: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}

  
  detectClicked(){
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  getPersonalForm(){
    this.personalDetailsForm = new FormGroup({
      firstName: new FormControl('Damilola', [Validators.required]),
      lastName: new FormControl('Olusanya', [Validators.required]),
      middleName: new FormControl('Kemisola', [Validators.required]),
      phoneNumber: new FormControl('08145677575', [Validators.required]),
      bvn: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      gender: new FormControl('Male', [Validators.required]),
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
    console.log("form values>>", this.personalDetailsForm.value);
    this.routeService.setRouteToDisplay("residential details");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'residential_details'
      }
    })
   }
  }

}
