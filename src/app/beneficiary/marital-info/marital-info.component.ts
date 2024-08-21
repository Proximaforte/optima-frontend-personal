import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-marital-info',
  templateUrl: './marital-info.component.html',
  styleUrls: ['./marital-info.component.scss'],
})
export class MaritalInfoComponent implements OnInit {
  panelOpenState = false;
  options: String[] = ['Is the child currently schooling?*', 'yes', 'no'];
  emailPlaceHolder: string = '';
  otherPlaceHolder: string = '';
  spouse: number = 0;
  spouseArray: any[] = [];
  children: number = 0;
  childrenArray: any[] = [];
  maritalInfoForm!: FormGroup;
  spouseFormGroup!: FormGroup;
  childFormGroup!: FormGroup;
  showChildren: boolean = false;

  nameOfSpouse: string = 'nameOfSpouse';
  phoneNumberOfSpouse: string = 'phoneNumberOfSpouse';

  nameOfChild: string = 'nameOfChild';
  ageOfChild: string = 'ageOfChild';
  childEducationStatus: string = 'childEducationStatus';
  nameOfChildsSchool: string = 'nameOfChildsSchool';
  phoneNumberOfChild: string = 'phoneNumberOfChild';

  showOthers: boolean = false;
  nameOfSpousePlaceHolder: string = '';
  phoneNumberOfSpousePlaceHolder: string = '';
  showNameOfChildSch: boolean[] = [];

  userDetails: any = {};
  showSpinner: boolean = false;
  disableBtn: boolean = true;

  showWelcomeMsg: boolean = false;
  dateOfBirth: string = "Input child's date of birth";

  nameOfChildren: any[] = [];
  ageOfChildren: any[] = [];
  childrenEduStatus: any[] = [];
  nameOfChildSchool: any[] = [];
  childPhoneNumber: any[] = [];
  dobOfChild: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiarySerice: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
  ) {
    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    const getMessage: any = localStorage.getItem('incomplete');
    if (getMessage !== null) {
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        localStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }
  }

  ngOnInit(): void {
    this.getMaritalForm();
  }

  getMaritalForm() {
    this.maritalInfoForm = new FormGroup({
      maritalStatus: new FormControl('Marital Status', [Validators.required]),
      numberOfSpouse: new FormControl('', null),
      numberOfChildren: new FormControl('', null),
      nameOfSpouses: new FormControl('', null),
      phoneNumberOfSpouses: new FormControl('', null),
    });

    this.maritalInfoForm.get('maritalStatus')?.valueChanges?.subscribe({
      next: (value: string) => {
        if (value === 'MARRIED') {
          this.showOthers = true;
          this.disableBtn = true;
        } else {
          this.showOthers = false;
        }

        if (value === 'Marital Status') {
          this.disableBtn = true;
        }

        if (value === 'SINGLE') {
          this.disableBtn = false;
          this.showChildren = false;
          this.maritalInfoForm.patchValue({ numberOfSpouse: '' });
        }
        if (value === 'DIVORCED') {
          this.disableBtn = false;
          this.showChildren = true;
          this.maritalInfoForm.patchValue({ numberOfSpouse: '' });
        } 
        if (value === 'WIDOW') {
          this.disableBtn = false;
          this.showChildren = true;
          this.maritalInfoForm.patchValue({ numberOfSpouse: '' });
        }
        if (value === 'WIDOWER') {
          this.disableBtn = false;
          this.showChildren = true;
          this.maritalInfoForm.patchValue({ numberOfSpouse: '' });
        }
        if (
          value === 'MARRIED' ||
          (value === 'MARRIED' &&
            this.maritalInfoForm?.get('numberOfSpouse')?.value?.length === 0)
        ) {
          this.disableBtn = true;
        }
      },
    });

    this.maritalInfoForm?.get('numberOfSpouse')?.valueChanges.subscribe({
      next: (values: any) => {
        this.spouse = Number(values);
      },
    });

    this.maritalInfoForm?.get('numberOfChildren')?.valueChanges.subscribe({
      next: (value: any) => {
        this.children = Number(value);
      },
    });

    this.maritalInfoForm.valueChanges.subscribe(() => this.updateDisabledBtn());
  }
  updateDisabledBtn() {
    const numberOfSpouse = this.maritalInfoForm.get('numberOfSpouse')?.value;

    if (numberOfSpouse > 0) {
      for (let i = 0; i < numberOfSpouse; i++) {
        if (!this.nameOfSpouses[i] || !this.phoneNumberOfSpouses[i]) {
          this.disableBtn = true;
          return;
        }
      }
    }
    

    this.disableBtn = !this.maritalInfoForm.valid;
  }

  detectClicked() {
    this.emailPlaceHolder = 'Input number of spouse(s)';
    // this.disableBtn = false;
  }
  onInputBlur() {
    this.emailPlaceHolder = '';
    // this.disableBtn = false;
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
    this.updateDisabledBtn();
  }

  async pushPhoneNumberOfSpouses(event: any, index: any): Promise<any> {
    await this.phoneNumberOfSpouses.splice(index - 1, 0, event?.target?.value);
    this.updateDisabledBtn();
  }

  // listen(event: any, position: number): any {
  //   if (event?.target?.value === 'yes') {
  //     this.showNameOfChildSch = true;
  //   }
  //   else if (event?.target?.value === 'not yet') {
  //     this.showNameOfChildSch = false;
  //   } else {
  //     this.showNameOfChildSch = null;
  //   }
  // }

  listen(event: any, index: number): void {
    const value = event?.target?.value;
    this.showNameOfChildSch[index] = value === 'yes';
  }

  pushNameOfChildren(event: any, index: any) {
    this.nameOfChildren.splice(index - 1, 0, event?.target?.value);
  }

  pushAgeOfChildren(event: any, index: any) {
    this.ageOfChildren.splice(index - 1, 0, Number(event?.target?.value));
  }

  pushIsChildInSchool(event: any, index: any) {
    this.childrenEduStatus.splice(index - 1, 0, this.showNameOfChildSch[index]);
  }

  pushChildPhoneNumber(event: any, index: any) {
    this.childPhoneNumber.splice(index - 1, 0, event?.target?.value);
  }

  pushNameOfChildSchool(event: any, index: any) {
    this.nameOfChildSchool.splice(index - 1, 0, event?.target?.value);
  }
  //dobOfChild
  pushDOBofChild(event: any, index: any) {
    this.dobOfChild.splice(index - 1, 0, event);
  }

  numbersArray(spouse: number): number[] {
    this.spouseArray = Array(spouse);
    return Array(spouse)
      .fill(0)
      .map((x, i) => i + 1);
  }

  numbersArrayNext(children: number): number[] {
    this.childrenArray = Array(children);
    return Array(children)
      .fill(0)
      .map((x, i) => i + 1);
  }

  datePipe(event: any, index: any) {
    var dateObject = new Date(event);
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    var formattedDate =
      (day < 10 ? '0' : '') +
      day +
      '/' +
      (month < 10 ? '0' : '') +
      month +
      '/' +
      year;
    var letDate = formattedDate.split('/');
    var formattedDates = `${parseInt(letDate[0], 10)}/${parseInt(letDate[1], 10)}/${letDate[2]}`;
    this.pushDOBofChild(formattedDates, index);
    return formattedDates;
  }

  submitForm() {
    this.showSpinner = true;

    const spousalArray: any[] = [];
    for (
      let i = 0;
      i <
      Math.min(this.nameOfSpouses?.length, this.phoneNumberOfSpouses?.length);
      i++
    ) {
      const spousalObj = {
        name: this.nameOfSpouses[i],
        phoneNumber: this.phoneNumberOfSpouses[i],
      };
      spousalArray.push(spousalObj);
    }

    // Ensure all child-related arrays have the same length
    const maxLength = Math.max(
      this.nameOfChildren.length,
      // this.childrenEduStatus.length,
      this.dobOfChild.length,
    );

    const childrenArray: any[] = [];
    for (
      let i = 0;
      i <
      Math.min(
        this.nameOfChildren.length,
      );
      i++
    ) {
      // Check if the current index in each array has a valid value
      // if (
      //   this.nameOfChildren[i] &&
      //   this.childrenEduStatus[i] !== undefined &&
      //   this.childPhoneNumber[i] &&
      //   this.nameOfChildSchool[i] &&
      //   this.dobOfChild[i]
      // ) {
        const ChildrenObj = {
          name: this.nameOfChildren[i],
          inSchool: this.childrenEduStatus[i],
          phoneNumber: this.childPhoneNumber[i],
          schoolName: this.nameOfChildSchool[i],
          dob: this.dobOfChild[i],
        };
        childrenArray.push(ChildrenObj);
      }
    // }

    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const payload = {
      phoneNumber: getBeneficiaryPhoneNumber,
      maritalStatus: this.maritalInfoForm.get('maritalStatus')?.value,
      spouseList: spousalArray,
      childList: childrenArray,
    };

    if (
      this.nameOfChildren?.length === 0 &&
      Number(this.maritalInfoForm.value.numberOfChildren) > 0
    ) {
      this.toast.setErrorMessage('Name of child is an important field');
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    } else if (
      this.nameOfChildren?.length > 0 &&
      this.dobOfChild?.length === 0
    ) {
      this.toast.setErrorMessage('Date of Birth is a required field');
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    } else {
      this.beneficiarySerice.maritalDetails(payload).subscribe({
        next: (res: any) => {
          this.showSpinner = false;
          this.toast.setSuccessMessage(
            'Beneficiary Marital Status is onboarded successfully!',
          );
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
          this.beneficiarySerice.setRouteToDisplay('education');
          this.router.navigate(['/home/beneficiary'], {
            relativeTo: this.route,
            queryParams: {
              progress: 'education',
            },
          });
        },
        error: (err: any) => {
          console.error('err>>', err);
          this.showSpinner = false;
          this.toast.setErrorMessage(
            err?.error?.responseMessage ||
              err?.error?.responseMessage ||
              err?.statusText ||
              'Oops an error occurred!',
          );
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        },
      });
    }
  }
}
