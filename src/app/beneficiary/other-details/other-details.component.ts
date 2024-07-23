import { Component, OnInit } from '@angular/core';
import { SuccessfulBeneficiaryOnboardingComponent } from 'src/app/utilities/modals/successful-beneficiary-onboarding/successful-beneficiary-onboarding.component';
import { MatDialog } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss'],
})
export class OtherDetailsComponent implements OnInit {
  options: string[] | any = [
    'If yes, please specify the type of crime*',
    'Theft',
    'Assault',
    'Drug',
    'Fraud',
    'Drug-related offenses',
    'Traffic violation',
    'Others',
  ];
  option2: string[] | any = [
    'What modes of transportation are available to you?*',
    "Car",
    "Bicycle",
    "Motorcycle",
    "Walking",
    "Public transportation",
    "Other, please specify",
  ];
  option3: string[] | any = [
    'What is your political view?*',
    'active',
    'passive',
  ];
  option4: string[] | any = [
    'How often do you vote?*',
    'Always',
    'Sometimes',
    'Rarely',
    'Never',
  ];
  option5: string[] | any = [
    'How engaged are you in political activities?*',
    'Very Engaged',
    'Moderately Engaged',
    'Not Engaged',
  ];
  option6: string[] | any = [
    'Which political party do you prefer?*',
    "All Progressives Congress",
    "Labour Party",
    "People's Democratic Party",
    "Social Democratic Party",
    "Others, please specify",
    "None of the above",
    "Prefer not to say"
  ];
  option7: string[] | any = [
    'If yes, please select*',
    "All Progressives Congress",
    "Labour Party",
    "People's Democratic Party",
    "Social Democratic Party",
    "Others, please specify",
    "None of the above",
    "Prefer not to say"
  ];
  option8: string[] | any = [
    'Do you participate in community meetings or political rallies?*',
    'Yes',
    'No',
  ];
  option9: string[] | any = [
    'How would you rate the crime rate in your area?*',
    'Low',
    'Medium',
    'High',
  ];
  option10: string[] | any = [
    'What are your main sources of drinking water?*',
    'Piped water',
    'Borehole',
    'Well',
    'River/Stream',
    'Bottled water',
    'Others',
  ];
  option11: string[] | any = [
    'How far is the water source from your home? (Specify distance)*',
    "< 1km",
    "1 - 5km",
    "5 - 10km",
    "10 - 20km",
    "20km & above"
  ];
  option12: string[] | any = [
    'What is the quality of the water?*',
    'Very Good',
    'Good',
    'Fair',
    'Poor',
    'Very Poor',
  ];
  option13: string[] | any = [
    'How many hours per day do you have electricity? (Specify)*',
    "< 1hr",
    "1 - 4hr",
    "4 - 8hr",
    "8 - 12hr",
    "12 - 16hr",
    "16hr & above"
  ];
  option14: string[] | any = [
    'What is the quality of roads in your area?*',
    'Very Good',
    'Good',
    'Fair',
    'Poor',
    'Very Poor',
  ];
  option15: string[] | any = [
    'what is your regular means of transportation?*',
    "Car",
    "Bicycle",
    "Motorcycle",
    "Walking",
    "Public transportation",
    "Other, please specify",
  ];

waterSources: string[] = ['What are your main sources of drinking water?*'];
votingPeriod: string[] = ['How often do you vote?*'];
votingEngagements: string[] = ['How engaged are you in political activities?*']
politicalParties: string[] = ['Which political party do you prefer?*'];
crimeType: string[] = ['If yes, for what offence?*'];
waterDistance: string[] = ['How far is the water source from your home? (Specify distance)*'];
waterQualityRating: string[] = ['What is the quality of the water?*'];
electricityHour: string[] = ['How many hours per day do you have electricity? (Specify)*'];
roadQuality: string[] = ['What is the quality of roads in your area?*'];
modesOfTransportation: string[] = ['What modes of transportation are available to you?*'];
meansOfTransportation: string[] = ['what is your regular means of transportation?*'];

waterSourceEndpoint: string = endpoints.waterSources;
votingPeriodEndpoint: string = endpoints.periods;
votingEngagementEndpoint: string = endpoints.engagements;
politicalPartiesEndpoint: string = endpoints.politicalParties;
crimeTypeEndpoint: string = endpoints.criminalTypes;
waterDistanceEndpoint: string = endpoints.getDistanceRanges;
qualityRating: string = endpoints.getQualityRating;
electricityHourEndpoint: string = endpoints.HourRanges;
modeOfTransportationEndpoint: string = endpoints.transportationModes
meansOfTransportationEndpoint: string = endpoints.transportTypes

  showAdditionalFields: boolean = false;
  showAdditionalFields1: boolean = false;
  checked1: boolean | any;
  checked2: boolean | any;
  checked3: boolean | any;
  checked4: boolean | any;
  checked5: boolean | any;
  checked6: boolean | any;
  checked7: boolean | any;
  checked8: boolean | any;
  checked9: boolean | any;
  checked10: boolean | any;
  checked11: boolean | any;
  checked12: boolean | any;
  checked13: boolean | any;
  checked14: boolean | any;
  checked15: boolean | any;
  checked16: boolean | any;
  checked17: boolean | any;
  checked18: boolean | any;
  checked19: boolean | any;
  checked20: boolean | any;
  checked21: boolean | any;
  checked22: boolean | any;
  checked23: boolean | any;

  othersForm!: FormGroup;
  showSpecifyCrime: boolean = false;
  userDetails: any = {};
  showSpinner: boolean = false;
  disableBtn: boolean = true;
  showOwnCar: boolean = false;

  showWelcomeMsg: boolean = false;

  constructor(
    private dialog: MatDialog,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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

    this.othersForm = this.fb.group({
      politicalView: [''],
      otherPoliticalView: [''],
      waterSupply: [''],
      otherWaterSupply: [''],
      transportMeans: [''],
      otherTransportMeans: [''],
    });
  }

  get politicalView() {
    return this.othersForm.get('politicalView')?.value;
  }

  get waterSupply() {
    return this.othersForm.get('waterSupply')?.value;
  }

  get transportationModes() {
    return this.othersForm.get('transportationModes')?.value;
  }

  proceed() {
    if (this.othersForm.get('waterSource')?.value?.toLowerCase().includes("others")) {
      this.showAdditionalFields = true;
    } else {
      this.showAdditionalFields = false;
    }
  }

  getEnumValue(dataPoint: Array<string>, defaultParam: string, endpoint: string) {
    this.beneficiaryService.getEnum(endpoint).subscribe({
      next: (data: any) => {
        if (data.data) {
          const resultArray = Array.isArray(data?.data) ? [defaultParam, ...data.data] : [];
          for (let i = 0; i < resultArray.length; i++) {
            dataPoint[i] = resultArray[i];
          }
        } else {
          dataPoint = []
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
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

  proceed2() {
    if (this.othersForm.get('transportationModes')?.value?.toLowerCase().includes("others")) {
      this.showAdditionalFields = true;
    } else {
      this.showAdditionalFields = false;
    }
  }
  proceed1() {
    if (this.othersForm.get('waterSupply')?.value?.toLowerCase().includes("others")) {
      this.showAdditionalFields = true;
    } else {
      this.showAdditionalFields = false;
    }
  }
  onSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
    this.othersForm.get('transportationModes')?.setValue(selectedOptions);
  }
  detectTouched(radioType: string) {
    if (radioType === 'radio1') {
      this.checked2 = false;
      this.checked1 = true;
    } else if (radioType === 'radio2') {
      this.checked1 = false;
      this.checked2 = true;
    }
  }
  detectTouched1(radioType: string) {
    if (radioType === 'radio3') {
      this.checked4 = false;
      this.checked3 = true;
    } else if (radioType === 'radio4') {
      this.checked3 = false;
      this.checked4 = true;
    }
  }
  detectTouched2(radioType: string) {
    if (radioType === 'radio5') {
      this.checked6 = false;
      this.checked5 = true;
    } else if (radioType === 'radio6') {
      this.checked5 = false;
      this.checked6 = true;
    }
  }
  detectTouched3(radioType: string) {
    if (radioType === 'radio7') {
      this.checked8 = false;
      this.checked7 = true;
    } else if (radioType === 'radio8') {
      this.checked7 = false;
      this.checked8 = true;
    }
  }
  detectTouched4(radioType: string) {
    if (radioType === 'radio9') {
      this.checked10 = false;
      this.checked9 = true;
    } else if (radioType === 'radio10') {
      this.checked9 = false;
      this.checked10 = true;
    }
  }
  detectTouched5(radioType: string) {
    if (radioType === 'radio11') {
      this.checked12 = false;
      this.checked11 = true;
    } else if (radioType === 'radio12') {
      this.checked11 = false;
      this.checked12 = true;
    }
  }
  detectTouched6(radioType: string) {
    if (radioType === 'radio13') {
      this.checked13 = false;
      this.checked14 = true;
    } else if (radioType === 'radio14') {
      this.checked13 = false;
      this.checked14 = true;
    }
  }
  detectTouched7(radioType: string) {
    if (radioType === 'radio15') {
      this.checked15 = true;
      this.checked16 = false;
    } else if (radioType === 'radio16') {
      this.checked15 = false;
      this.checked16 = true;
    }
  }
  detectTouched8(radioType: string) {
    if (radioType === 'radio17') {
      this.checked17 = false;
      this.checked18 = true;
    } else if (radioType === 'radio18') {
      this.checked17 = false;
      this.checked18 = true;
    }
  }
  detectTouched9(radioType: string) {
    if (radioType === 'radio19') {
      this.checked19 = true;
    } else {
      this.checked19 = false;
    }
  }
  detectTouched10(radioType: string) {
    if (radioType === 'radio20') {
      this.checked19 = true;
    } else {
      this.checked19 = false;
    }
  }

  getOthersForm() {
    this.othersForm = new FormGroup({
      politicalView: new FormControl('', [Validators.required]),
      crimeType: new FormControl('', [Validators.required]),
      specifyCrimeType: new FormControl('', [Validators.required]),
      crimeDescription: new FormControl('', [Validators.required]),
      transportMeans: new FormControl('', [Validators.required]),
      participateInCommunityOrPolitics: new FormControl('', [Validators.required]),
      numberOfCar: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      recentlyVote: new FormControl('', [Validators.required]),
      voteFrequency: new FormControl('', [Validators.required]),
      preferredPoliticalParty: new FormControl('', [Validators.required]),
      specifyPreferredPoliticalParty: new FormControl('', [Validators.required]),
      memberOfPoliticalParty: new FormControl('', [Validators.required]),
      specifyPoliticalParty: new FormControl('', [Validators.required]),
      politicalActivityEngagement: new FormControl('', [Validators.required]),
      areaCrimeRating: new FormControl('', [Validators.required]),
      beenVictimOfCrime: new FormControl('', [Validators.required]),
      victimCrimeTypeSpecify: new FormControl('', [Validators.required]),
      hasCommunityDispute: new FormControl('', [Validators.required]),
      specifyCommunityDispute: new FormControl('', [Validators.required]),
      awareOfFamilyPlanning: new FormControl('', [Validators.required]),
      numberOfChildren: new FormControl('', [Validators.required]),
      hasAccessToFamilyPlanning: new FormControl('', [Validators.required]),
      hasAccessToSanitationFacilities: new FormControl('', [Validators.required]),
      waterSupply: new FormControl('', [Validators.required]),
      specifyWaterSource: new FormControl('', [Validators.required]),
      haveAccessToWater: new FormControl('', [Validators.required]),
      distanceToWater: new FormControl('', [Validators.required]),
      waterQuality: new FormControl('', [Validators.required]),
      haveAccessToElectricity: new FormControl('', [Validators.required]),
      timeOfAccessToElectricity: new FormControl('', [Validators.required]),
      roadQuality: new FormControl('', [Validators.required]),
      transportationModes: new FormControl('', [Validators.required]),
      specifyTransportationMode: new FormControl('', [Validators.required]),
    });

    this.othersForm.get('crimeType')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value.toLowerCase() === 'others') {
          this.showSpecifyCrime = true;
        } else {
          this.showSpecifyCrime = false;
        }
      },
    });

    this.othersForm.get('transportMeans')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value.toLowerCase().includes('car')) {
          this.showOwnCar = true;
          this.disableBtn = true;
        } else {
          this.showOwnCar = false;
          this.disableBtn = false;
        }
      },
    });

    this.othersForm.get('numberOfCar')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value <= 0) {
          this.disableBtn = true;
        } else {
          this.disableBtn = false;
        }
      },
    });
  }

  getDropdownItems() {
    // this.beneficiaryService.getTransportDropdown().subscribe({
    //   next: (item: any) => {
    //     this.option2 = new Set(
    //       [
    //         'what is your regular means of transportation?*',
    //         "Car",
    //         "Bicycle",
    //         "Motorcycle",
    //         "Walking",
    //         "Public transportation",
    //         "Other, please specify",
    //       ].concat(item.data),
    //     );
    //   },
    // });

    // this.beneficiaryService.getCriminalTypesDropdown().subscribe({
    //   next: (item: any) => {
    //     this.options = new Set(
    //       [
    //         'If yes, for what offence?*',
    //         'Theft',
    //         'Assault',
    //         'Drug',
    //         'Fraud',
    //         'Drug-related offenses',
    //         'Traffic violation',
    //         'Others',
    //       ].concat(item.data),
    //     );
    //   },
    // });
  }

  ngOnInit(): void {
    this.getOthersForm();
  }

  succesfulOboarding() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const payload = {
      phoneNumber: getBeneficiaryPhoneNumber,
      politicalView: this.othersForm.value?.politicalView,
      convicted: this.checked15,
      crimeType:
        this.checked15 === true ? this.othersForm.value?.crimeType : "",
      specifyCrimeType: this.othersForm.value?.specifyCrimeType,
      transportMeans: this.othersForm.value?.transportMeans,
      numberOfCar: this.othersForm.value?.numberOfCar ?? "",
      crimeDescription: this.othersForm.value?.crimeDescription,
      recentlyVote: this.checked1,
      voteFrequency: this.othersForm.value?.voteFrequency,
      preferredPoliticalParty: this.othersForm.value?.preferredPoliticalParty,
      specifyPreferredPoliticalParty: this.othersForm.value?.specifyPreferredPoliticalParty,
      memberOfPoliticalParty: this.checked3,
      specifyPoliticalParty: this.othersForm.value?.specifyPoliticalParty,
      politicalActivityEngagement: this.othersForm.value?.politicalActivityEngagement,
      participateInCommunityOrPolitics: this.othersForm.value?.participateInCommunityOrPolitics?.toLowerCase() === "yes",
      areaCrimeRating: this.othersForm.value?.areaCrimeRating,
      beenVictimOfCrime: this.checked5,
      victimCrimeTypeSpecify: this.othersForm.value?.victimCrimeTypeSpecify,
      hasCommunityDispute: this.checked7,
      specifyCommunityDispute: this.othersForm.value?.specifyCommunityDispute,
      awareOfFamilyPlanning: this.checked17,
      numberOfChildren: this.othersForm.value?.numberOfChildren,
      hasAccessToFamilyPlanning: this.checked20,
      hasAccessToSanitationFacilities: this.checked19,
      waterSource: this.othersForm.value?.waterSupply,
      specifyWaterSource: this.othersForm.value?.specifyWaterSource,
      haveAccessToWater: this.checked11,
      distanceToWater: this.othersForm.value?.distanceToWater,
      waterQuality: this.othersForm.value?.waterQuality,
      haveAccessToElectricity: this.checked13,
      timeOfAccessToElectricity: this.othersForm.value?.timeOfAccessToElectricity,
      roadQuality: this.othersForm.value?.roadQuality,
      transportationModes: [this.othersForm.value?.transportationModes],
      specifyTransportationMode: this.othersForm.value?.specifyTransportationMode,
    };

    //console.log('payload>>>', payload);

    this.beneficiaryService.otherDetails(payload).subscribe({
      next: (res: any) => {
        // console.log("res>>>", res);
        this.showSpinner = false;
        this.beneficiaryService.onboardingSubmitted(getBeneficiaryPhoneNumber).subscribe({
          next: (res:any) => {
           // console.log('res>>>', res);
           this.dialog.open(SuccessfulBeneficiaryOnboardingComponent);
          },
          error: (err: any) => {
            console.error('err>>>', err);
            this.toast.setErrorMessage(err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
            this.router.navigate(['/home/all-beneficiary'],{relativeTo: this.route});
            if(err?.status === 401){
            this.auth.agentLogout();
            }
          }
        })
        
      },
      error: (err: any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
        // this.toast.setSuccessMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
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
      },
    });
  }
}
