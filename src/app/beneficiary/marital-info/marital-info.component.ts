import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-marital-info',
  templateUrl: './marital-info.component.html',
  styleUrls: ['./marital-info.component.scss']
})
export class MaritalInfoComponent implements OnInit {
  panelOpenState = false;
  options: String[] = [
    "Marital Status",
    "Single",
    "Married",
    "Divorced",
    "Widow",
    "Widower"
  ];
  emailPlaceHolder: string = '';
  otherPlaceHolder: string = '';
  spouse: number = 0;
  spouseArray: any[] = [];
  children: number = 0;
  childrenArray: any[] = [];
  maritalInfoForm!: FormGroup;
  spouseFormGroup!: FormGroup;
  childFormGroup!: FormGroup;

  nameOfSpouse: string = 'nameOfSpouse';
  phoneNumberOfSpouse: string = 'phoneNumberOfSpouse';

  nameOfChild: string = 'nameOfChild'
  ageOfChild: string = 'ageOfChild';
  childEducationStatus: string = 'childEducationStatus';
  nameOfChildsSchool: string = 'nameOfChildsSchool';
  phoneNumberOfChild: string = 'phoneNumberOfChild'

  showOthers: boolean = false;
  nameOfSpousePlaceHolder: string = "";
  phoneNumberOfSpousePlaceHolder: string = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ) {
    this.options = [
      "Marital Status",
      "Single",
      "Married",
      "Divorced",
      "Widow",
      "Widower"
    ]
  }

  ngOnInit(): void {
    this.getMaritalForm();
  }

  getMaritalForm() {
    this.maritalInfoForm = new FormGroup({
      maritalStatus: new FormControl('Marital Status', [Validators.required]),
      numberOfSpouse: new FormControl('', [Validators.required]),
      numberOfChildren: new FormControl('', [Validators.required]),
    });

    this.maritalInfoForm.get('maritalStatus')?.valueChanges?.subscribe({
      next: (value: string) => {
        if (value === "Married") {
          this.showOthers = true;
        } else {
          this.showOthers = false;
        }
      }
    })

    this.maritalInfoForm?.get('numberOfSpouse')?.valueChanges.subscribe({
      next: (value: any) => {
        this.spouse = Number(value)
      }
    })

    this.maritalInfoForm?.get('numberOfChildren')?.valueChanges.subscribe({
      next: (value: any) => {
        this.children = Number(value);
      }
    })
  }

  detectClicked() {
    this.emailPlaceHolder = 'Input number of spouse(s)';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  detectClicked_() {
    this.otherPlaceHolder = 'Input number of children';
  }
  onInputBlur_() {
    this.otherPlaceHolder = '';
  }

  nameOfSpouses: any = [];
  phoneNumberOfSpouses: any = [];

  pushNameOfSpouses(event: any) {
    this.nameOfSpouses.push(event?.target?.value);
  //  console.log("Name Array>>", this.nameOfSpouses);
  }

  pushPhoneNumberOfSpouses(event: any) {
    this.phoneNumberOfSpouses.push(event?.target?.value);
   // console.log("Phone Number Array>>", this.phoneNumberOfSpouses);
  }

  numbersArray(spouse: number): number[] {
    this.spouseArray = Array(spouse);
    return Array(spouse).fill(0).map((x, i) => i + 1);
  }

  numbersArrayNext(children: number): number[] {
    this.childrenArray = Array(children);
    return Array(children).fill(0).map((x, i) => i + 1);
  }

  submitForm() {
    const spousalArray: any[] = [];
    for (let i = 0; i < Math.min(this.nameOfSpouses?.length, this.phoneNumberOfSpouses?.length); i++) {
      const spousalObj = {
        name: this.nameOfSpouses[i],
        phoneNumber: this.phoneNumberOfSpouses[i]
      }
      spousalArray.push(spousalObj);
    }
    console.log("spousal form>>>", spousalArray)
    // this.routeService.setRouteToDisplay("education");
    // this.router.navigate(['/home/beneficiary'],{
    //   relativeTo: this.route,
    //   queryParams: {
    //     progress: 'education'
    //   }
    // })
  }

}
