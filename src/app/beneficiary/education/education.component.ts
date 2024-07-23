import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  options: string[] | any = [
    'Level of Education*',
    'SSCE',
    'OND',
    'HND',
    'B.Sc',
    'B.Tech',
    'B.Eng',
    'MSc',
    'Phd',
    'Others',
    'None of the above',
  ];

  fundingOptions: string[] | any = [
    'Who is your sponsor?*',
    'Parents',
    'Self-Funded',
    'Scholarship',
    'Free Government Support / Subsidized Education',
  ];

  showAdditionalFields: boolean = false;
  options1 = ['Option 1', 'Option 2', 'Option 3']; // Replace with your actual options
  fundingOptions1 = [
    'Funding Option 1',
    'Funding Option 2',
    'Funding Option 3',
  ]; // Replace with your actual funding options

  checked: boolean | any = false;
  showOthers: boolean = false;
  educationForm!: FormGroup;
  disableBtn: boolean = true;
  userDetails: any = {};
  showSpinner: boolean = false;
  showWelcomeMsg: boolean = false;
  showOtherLevel: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
    private fb: FormBuilder,
    private stateService: StateService, // Inject StateService
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

  ngOnInit() {
    this.getEduForm();
    this.getDropDownTypes();
  }

  isProceedDisabled() {
    if (this.educationForm.get('eduLevel')?.value === 'Yes') {
      return !this.educationForm.valid;
    } else if (
      this.educationForm.get('eduLevel')?.value === 'Can you read and write?*'
    ) {
      return (this.disableBtn = true);
    } else {
      return this.educationForm.get('eduLevel')?.invalid;
    }
  }

  proceed() {
    if (this.educationForm.get('canReadWrite')?.value === 'yes') {
      this.showAdditionalFields = true;
    }
  }

  options2 = ['Can you read and write?*', 'Yes', 'No'];

  toggleChecked(event: any) {
    if (event === true) {
      this.showOthers = true;
      this.disableBtn = true;
      this.cheeckIfEductionDetailsAreFilled();
    } else {
      this.showOthers = false;
      this.disableBtn = true;
    }
  }

  cheeckIfEductionDetailsAreFilled() {
    if (
      this.showOthers === true &&
      this.educationForm?.get('funding')?.value?.length === 0
    ) {
      this.toast.setSuccessMessage('Educational Funding is required');
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    } else if (
      this.showOthers === true &&
      this.educationForm?.get('currentLevel')?.value?.length === 0
    ) {
      this.toast.setSuccessMessage('Educational Current Level is required');
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    } else {
      this.disableBtn = false;
    }
  }

  getDropDownTypes() {
    this.beneficiaryService.getEducationDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set(
          [
            'Level of Education*',
            'SSCE',
            'OND',
            'HND',
            'B.Sc',
            'B.Tech',
            'B.Eng',
            'MSc',
            'Phd',
            'Others',
            'None of the above',
          ].concat(item.data),
        );
      },
    });

    this.beneficiaryService.getEducationSponsorDropdown().subscribe({
      next: (item: any) => {
        this.fundingOptions = new Set(
          [
            'Who is your sponsor?*',
            'Parents',
            'Self-Funded',
            'Scholarship',
            'Free Government Support / Subsidized Education',
          ].concat(item.data),
        );
      },
    });
  }

  getEduForm() {
    this.educationForm = new FormGroup({
      eduLevel: new FormControl('', [Validators.required]),
      certifications: new FormControl(''),
      level_of_edu: new FormControl(''),
      primarySchAttended: new FormControl(''),
      primarySchLocation: new FormControl(''),
      secSchAttended: new FormControl(''),
      secSchLocation: new FormControl(''),
      tertiaryInstitutionAttended: new FormControl(''),
      tertiaryInstitutionLocation: new FormControl(''),
      currentLevel: new FormControl(''),
      funding: new FormControl(''),
      otherLevel: new FormControl(''),
    });

    this.educationForm.get('level_of_edu')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === 'Others' || value === 'None of the above') {
          this.showOtherLevel = true;
          this.educationForm
            .get('otherLevel')
            ?.setValidators(Validators.required);
        } else {
          this.showOtherLevel = false;
          this.educationForm.get('otherLevel')?.clearValidators();
        }
        this.educationForm.get('otherLevel')?.updateValueAndValidity();
      },
    });

    this.educationForm.get('eduLevel')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === 'Yes') {
          this.educationForm
            .get('certifications')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('primarySchAttended')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('primarySchLocation')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('level_of_edu')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('secSchAttended')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('secSchLocation')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('tertiaryInstitutionAttended')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('tertiaryInstitutionLocation')
            ?.setValidators(Validators.required);
          this.educationForm
            .get('currentLevel')
            ?.setValidators(
              this.educationForm.value.currently_in_school &&
                Validators.required,
            );
          this.educationForm
            .get('funding')
            ?.setValidators(
              this.educationForm.value.currently_in_school &&
                Validators.required,
            );
        } else if (value === 'No') {
          this.educationForm.get('certifications')?.clearValidators();
          this.educationForm.get('primarySchAttended')?.clearValidators();
          this.educationForm.get('primarySchLocation')?.clearValidators();
          this.educationForm.get('level_of_edu')?.clearValidators();
          this.educationForm.get('secSchAttended')?.clearValidators();
          this.educationForm.get('secSchLocation')?.clearValidators();
          this.educationForm
            .get('tertiaryInstitutionAttended')
            ?.clearValidators();
          this.educationForm
            .get('tertiaryInstitutionLocation')
            ?.clearValidators();
          this.educationForm.get('currentLevel')?.clearValidators();
          this.educationForm.get('funding')?.clearValidators();
        }
        this.educationForm.updateValueAndValidity();
      },
    });

    this.educationForm.valueChanges.subscribe(() => {
      this.disableBtn = this.isProceedDisabled() as boolean;
    });
  }

  skip() {
    this.beneficiaryService.setRouteToDisplay('health');
    this.router.navigate(['/home/beneficiary'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'health',
      },
    });
  }

  submit() {
    this.beneficiaryService.setRouteToDisplay('education-second');
    this.stateService.setState('educationForm', this.educationForm.value);
    this.router.navigate(['/home/beneficiary'], {
      relativeTo: this.route,
      queryParams: { progress: 'education-second' },
    });
  }
}
