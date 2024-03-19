import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-marital-info',
  templateUrl: './marital-info.component.html',
  styleUrls: ['./marital-info.component.scss']
})
export class MaritalInfoComponent implements OnInit {
  panelOpenState = false;
  options: String[] = [
    "Is your child in school?*",
    "yes",
    "not yet",
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
  showNameOfChildSch: any = false;

  userDetails: any = {};
  showSpinner: boolean = false;
  disableBtn:boolean = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiarySerice: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);
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
        if (value === "MARRIED") {
          this.showOthers = true;
          this.disableBtn = false;
        } else {
          this.showOthers = false;
          this.disableBtn = false;
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



  async pushNameOfSpouses(event: any, index: any): Promise<any> {
    await this.nameOfSpouses.splice(index - 1, 0, event?.target?.value);
  }

  async pushPhoneNumberOfSpouses(event: any, index: any): Promise<any> {
    await this.phoneNumberOfSpouses.splice(index - 1, 0, event?.target?.value);
  }

  nameOfChildren: any[] = [];
  ageOfChildren: any[] = [];
  childrenEduStatus: any[] = [];
  nameOfChildSchool: any[] = [];
  childPhoneNumber: any[] = [];

  listen(event: any, position: number): any {
    if (event?.target?.value === 'yes') {
      this.showNameOfChildSch = true;
    } else if (event?.target?.value === 'not yet') {
      this.showNameOfChildSch = false;
    } else {
      this.showNameOfChildSch = null;
    }
  }

  pushNameOfChildren(event: any, index: any) {
    this.nameOfChildren.splice(index - 1, 0, event?.target?.value);
  }

  pushAgeOfChildren(event: any, index: any) {
    this.ageOfChildren.splice(index - 1, 0, event?.target?.value);
  }

  pushIsChildInSchool(event: any, index: any) {
    this.childrenEduStatus.splice(index - 1, 0, this.showNameOfChildSch);
  }

  pushChildPhoneNumber(event: any, index: any) {
    this.childPhoneNumber.splice(index - 1, 0, event?.target?.value);
  }

  pushNameOfChildSchool(event: any, index: any) {
    this.nameOfChildSchool.splice(index - 1, 0, event?.target?.value);
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
    this.showSpinner = true;
    const spousalArray: any[] = [];
    for (let i = 0; i < Math.min(this.nameOfSpouses?.length, this.phoneNumberOfSpouses?.length); i++) {
      const spousalObj = {
        name: this.nameOfSpouses[i],
        phoneNumber: this.phoneNumberOfSpouses[i]
      }
      spousalArray.push(spousalObj);
    }
    //  console.log("spousal form>>>", spousalArray);


    const childrenArray: any[] = [];
    for (let i = 0; i < Math.max(
      this.nameOfChildren?.length,
      this.ageOfChildren?.length,
      this.childrenEduStatus?.length,
      this.childPhoneNumber?.length,
      this.nameOfChildSchool?.length
    ); i++) {
      const ChildrenObj = {
        name: this.nameOfChildren[i],
        age: this.ageOfChildren[i],
        inSchool: this.childrenEduStatus[i],
        phoneNumber: this.childPhoneNumber[i],
        schoolName: this.nameOfChildSchool[i],
      }
      childrenArray.push(ChildrenObj);
      //  console.log("children form>>>", childrenArray);
    }

    const payload = {
      phoneNumber: this.userDetails?.phoneNumber,
      maritalStatus: this.maritalInfoForm.get('maritalStatus')?.value,
      spouseList: spousalArray,
      childList: childrenArray
    }

  //  console.log("marital payload>>>", payload);

    this.beneficiarySerice.maritalDetails(payload).subscribe({
      next: (res: any) => {
        //console.log("res>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Marital Status is onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiarySerice.setRouteToDisplay("education");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'education'
          }
        })
      },
      error: (err: any) => {
        console.error("err>>", err);
        this.showSpinner = false;
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      }
    })
  }

}
