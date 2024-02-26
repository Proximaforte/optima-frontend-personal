import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

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
  constructor(
    private fb: FormBuilder
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
    this.getSpouseForm();
    this.getChildrenForm();
  }

  getMaritalForm() {
    this.maritalInfoForm = new FormGroup({
      maritalStatus: new FormControl('Marital Status', [Validators.required]),
      numberOfSpouse: new FormControl('', [Validators.required]),
      numberOfChildren: new FormControl('', [Validators.required]),
    });

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


  getSpouseForm() {
    this.spouseFormGroup = this.fb.group({});
    for (let i = 1; i <= this.spouse; i++) {
      this.spouseFormGroup.addControl(this.nameOfSpouse, new FormControl(''));
      this.spouseFormGroup.addControl(this.phoneNumberOfSpouse, new FormControl(''));
    }
  }

  onInputSpouseChange(inputName: string, event: any) {
    console.log(`souse Input ${inputName} changed to: ${event?.target?.value}`);
  }




  getChildrenForm() {
    this.childFormGroup = this.fb.group({});
    for (let i = 1; i <= this.children; i++) {
      this.childFormGroup.addControl(this.nameOfChild, new FormControl(''));
      this.childFormGroup.addControl(this.ageOfChild, new FormControl(''));
      this.childFormGroup.addControl(this.childEducationStatus, new FormControl(''));
      this.childFormGroup.addControl(this.nameOfChildsSchool, new FormControl(''));
      this.childFormGroup.addControl(this.phoneNumberOfChild, new FormControl(''));
    }
  }

  onInputChildrenChange(inputName: string, event: any) {
    console.log(`child Input ${inputName} changed to: ${event?.target?.value}`);
  }


  submitForm(){
    const formValues = {
      parentForm: this.maritalInfoForm.value,
      spouseForm: this.spouseFormGroup.value,
      childrenForm: this.childFormGroup.value
    }
    console.log('Form values totals>>', formValues);
  }






  detectClicked() {
    this.emailPlaceHolder = 'Input email';
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
  }

  detectClicked_() {
    this.otherPlaceHolder = 'Input email';
  }
  onInputBlur_() {
    this.otherPlaceHolder = '';
  }

  numbersArray(spouse: number): number[] {
    this.spouseArray = Array(spouse);
    return Array(spouse).fill(0).map((x, i) => i + 1);
  }

  numbersArrayNext(children: number): number[] {
    this.childrenArray = Array(children);
    return Array(children).fill(0).map((x, i) => i + 1);
  }


}
