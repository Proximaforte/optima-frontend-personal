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
  selector: 'app-educationSecond',
  templateUrl: './educationSecond.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationSecondComponent implements OnInit {
  showAdditionalFields: boolean = false;

  checked: boolean | any = false;
  showOthers: boolean = false;
  educationSecondForm!: FormGroup;
  disableBtn: boolean = true;
  userDetails: any = {};
  showSpinner: boolean = false;
  dataLoading: boolean = false;
  showWelcomeMsg: boolean = false;
  showOtherLevel: boolean = false;
  educationFormData: any = {};
  distanceRanges: string[] = ['How far is the nearest school from your home?*'];
  conditionoptions: string[] = [
    'What is the quality of the educational facilities?*',
  ];
  options2: string[] = [
    'Can other members of your household read and write?*',
    'Yes',
    'No',
  ];
  options3: string[] = ['Do you have access to a nearby school?*', 'Yes', 'No'];
  options4: string[] = [
    'Are there any educational programs in your community?*',
    'Yes',
    'No',
  ];
  options5: string[] = [
    'Do you receive any educational support or scholarships?*',
    'Yes',
    'No',
  ];

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
    // Retrieve the state from shared service
    this.educationFormData = this.stateService.getState('educationForm');

    this.dataLoading = true;

    this.getDistanceRanges();
    this.getQualityRating();
    this.educationSecondFormGrp();
  }

  updateDisabledBtn() {
    this.disableBtn = !this.educationSecondForm.valid;
  }

  educationSecondFormGrp() {
    this.educationSecondForm = new FormGroup({
      can_read_write: new FormControl('', [Validators.required]),
      have_access_to_nearby_school: new FormControl('', [Validators.required]),
      school_distance: new FormControl('', [Validators.required]),
      education_quality: new FormControl(
        '',
        this.showOthers ? [Validators.required] : null,
      ),
      educational_program: new FormControl('', [Validators.required]),
      educational_support: new FormControl('', [Validators.required]),
    });

    this.educationSecondForm.valueChanges.subscribe(() =>
      this.updateDisabledBtn(),
    );
  }

  getDistanceRanges() {
    this.beneficiaryService.getDistanceRanges().subscribe({
      next: (data: any) => {
        this.dataLoading = false;
        this.distanceRanges = Array.isArray(data?.data)
          ? ['How far is the nearest school from your home?*', ...data?.data]
          : [];
      },
      error: (err: any) => {
        this.dataLoading = false;
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

  getQualityRating() {
    this.beneficiaryService.getAllQualityRatings().subscribe({
      next: (data: any) => {
        this.dataLoading = false;
        this.conditionoptions = Array.isArray(data?.data)
          ? [
              'What is the quality of the educational facilities?*',
              ...data?.data,
            ]
          : [];
      },
      error: (err: any) => {
        this.dataLoading = false;
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

  submit() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const payload = {
      phoneNumber: getBeneficiaryPhoneNumber,
      level: this.educationFormData.level_of_edu ? this.educationFormData.level_of_edu : null,
      otherLevel: this.educationFormData.otherLevel ? this.educationFormData.otherLevel : null,
      certification: this.educationFormData.certifications ? this.educationFormData.certifications : null,
      primarySchool: this.educationFormData.primarySchAttended ? this.educationFormData.primarySchAttended : null,
      primarySchoolAddress: this.educationFormData.primarySchLocation ? this.educationFormData.primarySchLocation : null,
      secondarySchool: this.educationFormData.secSchAttended ? this.educationFormData.secSchAttended : null,
      secondarySchoolAddress: this.educationFormData.secSchLocation ? this.educationFormData.secSchLocation : null,
      tertiarySchool: this.educationFormData.tertiaryInstitutionAttended ? this.educationFormData.tertiaryInstitutionAttended : null,
      tertiarySchoolAddress:
        this.educationFormData.tertiaryInstitutionLocation ? this.educationFormData.tertiaryInstitutionLocation : null,
      inSchool: this.showOthers,
      currentLevel: this.educationFormData.currentLevel ? this.educationFormData.currentLevel : null,
      funding: this.educationFormData.funding ? this.educationFormData.funding : null,
      canReadWrite:
        this.educationFormData.eduLevel?.toLowerCase() === 'yes',
      canFamilyMemberReadWrite:
        this.educationSecondForm.value.can_read_write?.toLowerCase() === 'yes',
      accessToSchool:
        this.educationSecondForm.value.have_access_to_nearby_school?.toLowerCase() ===
        'yes',
      distanceToSchool: this.educationSecondForm.value.school_distance ? this.educationSecondForm.value.school_distance : null,
      educationQualityRating: this.educationSecondForm.value.education_quality ?  this.educationSecondForm.value.education_quality : null,
      hasEducationProgram:
        this.educationSecondForm.value.educational_program?.toLowerCase() ===
        'yes',
      hasEducationSupport:
        this.educationSecondForm.value.educational_support?.toLowerCase() ===
        'yes',
    };
    this.beneficiaryService.educationDetails(payload).subscribe({
      next: (res: any) => {
        //console.log("res>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage(
          'Beneficiary Education data onboarded successfully!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay('health');
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'health',
          },
        });
      },
      error: (err: any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
        this.toast.setErrorMessage(
          err?.error?.responseMessage ||
            err?.error?.responseMessage ||
            err?.statusText ||
            'Oops an error occured!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });

        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      },
    });
  }
}
