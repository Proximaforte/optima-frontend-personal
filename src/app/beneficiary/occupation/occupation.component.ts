import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Occupation } from 'src/app/models/beneficiary/beneficiary';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { combineLatest, startWith } from 'rxjs';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss'],
})
export class OccupationComponent implements OnInit {
  options: string[] = [
    'What is your occupation*',
    'Student',
    'Civil servant',
    'Other',
  ];
  civilServiceCategoryOptions: string[] = [];
  option2: string[] = ['Other Sources of Income e.g farming business etc*'];
  option3: string[] | any = [
    'Sponsorship type*',
    'Parents',
    'Self-Funded',
    'Scholarship',
    'Free Government Support / Subsidized Education',
  ];
  option4: string[] | any = [
    '(For diploma students) Diploma type*',
    'National Diploma',
    'School Diploma',
    'Others',
  ];
  option5: string[] = ['Are you on transfer?*', 'Yes', 'No'];
  option6: string[] | any = [
    'What cadre are you?*',
    'PROFESSIONAL',
    'EXECUTIVE',
    'ADMIN',
  ];
  option10: string[] | any = [
    'Highest qualification*',
    'SSCE',
    'OND',
    'HND',
    'B.Sc',
    'B.Tech',
    'B.Eng',
    'MSc',
    'Phd',
    'NCE',
    'PGDE',
    'MBA',
    'M.Eng',
    'Trade Test',
    'None of the above, others',
  ];
  option7: string[] = ['On Study Leave?*', 'Yes', 'No'];
  option8: string[] = ['Have you gone on a training before?*', 'Yes', 'No'];
  option9: string[] | any = [
    'Local or Foreign? (Optional)',
    'Local',
    'Foreign',
  ];
  lgas: string[] = ['Which local government are you posted? (LGA)'];
  lgeas: string[] = ['Which local government are you posted? (LGEA)'];
  stateMinistries: string[] = ['Which ministry are you currently working?'];
  agencyList: string[] = ['Select agency'];
  showRetired: boolean = false;
  showSelfEmployed: boolean = false;
  showEmployed: boolean = false;
  occupationForm!: FormGroup;
  userDetails: any = {};
  showSpinner: boolean = false;
  showWelcomeMsg: boolean = false;
  showStudentsInfo: boolean = false;
  showCivilServerntsInfo: boolean = false;
  showAdditionalCivilServiceInfo: boolean = false;
  isFirstForm: boolean = false;
  showLGA: boolean = false;
  showLGEA: boolean = false;
  showMinitry: boolean = false;
  showAgency: boolean = false;
  showExtraInput: boolean = false;
  showNextStep: boolean = false;
  disableFirstFormBtn: boolean = true;
  checked: boolean = false;
  showOthers: boolean = false;
  showOtherzz: boolean = false;
  disableBtn: boolean = true;
  occupationEnums: Occupation = {
    phoneNumber: '',
    type: '',
    nameOfInstitution: '',
    matriculationNumber: '',
    faculty: '',
    department: '',
    funding: '',
    diplomaType: '',

    dateOfFistAppointment: '', //
    dateOfConfirmation: '', //
    onTransfer: null,
    dateOfTransfer: '', //
    cadre: '',
    highestQualification: '',
    gradeLevel: '',
    onStudyLeave: null,
    leavePaid: null, //
    trained: null,
    trainingType: '',
    professionalQualifications: [
      //
      '',
    ],
    psn: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
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

  currentWord: string = ''; // Input text
  words: string[] = []; // Array to hold the words
  currentWordz: string = ''; // Input text
  wordz: string[] = []; // Array to hold the words

  addWord() {
    if (this.currentWord.trim() !== '') {
      this.words.push(this.currentWord.trim());
      this.currentWord = ''; // Clear the input
    }
    // console.log('words array>>>', this.words);
    this.occupationEnums.professionalQualifications = this.words;
  }

  removeWord(word: string) {
    // Remove the selected word from the array
    this.words = this.words.filter((w) => w !== word);
  }

  addWord2() {
    if (this.currentWordz.trim() !== '') {
      this.wordz.push(this.currentWordz.trim());
      this.currentWordz = ''; // Clear the input
    }
    //  console.log('words array>>>', this.wordz);
  }

  removeWord2(word: string) {
    // Remove the selected word from the array
    this.wordz = this.wordz.filter((w) => w !== word);
  }

  getDropdownItems() {
    this.beneficiaryService.getEducationSponsorDropdown().subscribe({
      next: (item: any) => {
        this.option3 = new Set(
          [
            'Sponsorship type*',
            'Parents',
            'Self-Funded',
            'Scholarship',
            'Free Government Support / Subsidized Education',
          ].concat(item.data),
        );
      },
    });

    this.beneficiaryService.getDiplomaTypesDropdown().subscribe({
      next: (item: any) => {
        this.option4 = new Set(
          [
            '(For diploma students) Diploma type*',
            'National Diploma',
            'School Diploma',
          ].concat(item.data),
        );
      },
    });

    this.beneficiaryService.getCivilServiceCategory().subscribe({
      next: (item: any) => {
        this.civilServiceCategoryOptions = [
          ...this.civilServiceCategoryOptions,
          ...item.data,
        ];
      },
    });

    this.beneficiaryService.getEnum(endpoints.cityList).subscribe({
      next: (item: any) => {
        this.lgas = [...this.lgas, ...item.data];
        this.lgeas = [...this.lgeas, ...item.data];
      },
    });
    this.beneficiaryService.getEnum(endpoints.stateMinistries).subscribe({
      next: (item: any) => {
        this.stateMinistries = [...this.stateMinistries, ...item.data];
      },
    });

    this.beneficiaryService.getCadreTypesDropdown().subscribe({
      next: (item: any) => {
        this.option6 = new Set(
          ['What cadre are you?*', 'PROFESSIONAL', 'EXECUTIVE', 'ADMIN'].concat(
            item.data,
          ),
        );
      },
    });
  }

  ngOnInit(): void {
    this.getEmploymentForm();
    this.getDropdownItems();
  }

  getEmploymentForm() {
    this.occupationForm = new FormGroup({
      occupation: new FormControl('', [Validators.required]),
      nameOfInstitution: new FormControl('', [Validators.required]),
      matriculationNumber: new FormControl('', [Validators.required]),
      faculty: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      funding: new FormControl('', [Validators.required]),
      diplomaType: new FormControl('', [Validators.required]),
      specifyDiplomaType: new FormControl('', [Validators.required]),
      otherOccupation: new FormControl('', [Validators.required]),
      dateOfTransfer: new FormControl('', [Validators.required]),
      stateMinistryValue: new FormControl('', [Validators.required]),
      agencyValue: new FormControl('', [Validators.required]),
      lga: new FormControl('', [Validators.required]),
      lgea: new FormControl('', [Validators.required]),
      presentStation: new FormControl('', [Validators.required]),
      jobFunction: new FormControl('', [Validators.required]),
      civilServiceCategory: new FormControl('', [Validators.required]),
      onTransfer: new FormControl('', [Validators.required]),
      cadre: new FormControl('', [Validators.required]),
      highestQualification: new FormControl('', [Validators.required]),
      gradeLevel: new FormControl('', [Validators.required]),
      onStudyLeave: new FormControl('', [Validators.required]),
      trained: new FormControl('', [Validators.required]),
      trainingType: new FormControl('', [Validators.required]),
      psn: new FormControl('', [Validators.required]),
      tin: new FormControl('', [Validators.required]),
    });

    this.occupationForm.get('occupation')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === 'Student') {
          this.showStudentsInfo = true;
          this.showCivilServerntsInfo = false;
          this.showOtherzz = false;
        } else if (value === 'Civil servant') {
          this.showAdditionalCivilServiceInfo = true;
          this.showStudentsInfo = false;
          this.showOtherzz = false;
        } else if (value === 'Other') {
          this.showCivilServerntsInfo = false;
          this.showStudentsInfo = false;
          this.showOtherzz = true;
          this.showOthers = false;
        }
      },
    });

    this.occupationForm.get('civilServiceCategory')?.valueChanges.subscribe({
      next: (value: string) => {

        if (
          value.toUpperCase() === 'TESCOM' ||
          value.toUpperCase() === 'LOCAL GOVERNMENT'
        ) {
          this.occupationForm.get("presentStation")?.reset()
          this.occupationForm.get("jobFunction")?.reset()
          this.showLGA = true;
          this.showLGEA = false;
          this.showMinitry = false;
          this.showExtraInput = true;
          this.disableFirstFormBtn = true;
          this.showAgency = false;
        } else if (value.toUpperCase() === 'SUBEB') {
          this.showLGEA = true;
          this.showLGA = false;
          this.showMinitry = false;
          this.showExtraInput = true;
          this.disableFirstFormBtn = true
        } else if (value.toUpperCase() === 'STATE MINISTRY') {
          this.showMinitry = true;
          this.showLGEA = false;
          this.showLGA = false;
          this.showExtraInput = true;
          this.disableFirstFormBtn = true
        }
      },
    });

    this.occupationForm.get("lga")?.valueChanges.subscribe({
      next: (value: string) => {
        if (value !== "") {
          this.occupationForm.get("presentStation")?.valueChanges.subscribe({
            next: (value2: string) => {
              if (value2 !== "") {
                this.occupationForm.get("jobFunction")?.valueChanges.subscribe({
                  next: (value3: string) => {
                    if (value3 !== "") {
                      this.disableFirstFormBtn = false
                    }
                  }
                })
              }
            }
          })
        }
      }
    })

    // combineLatest([
    //   this.occupationForm
    //     .get('lga')
    //     ?.valueChanges.pipe(startWith(this.occupationForm.get('lga')?.value)),
    //   this.occupationForm
    //     .get('presentStation')
    //     ?.valueChanges.pipe(
    //       startWith(this.occupationForm.get('presentStation')?.value),
    //     ),
    //   this.occupationForm
    //     .get('jobFunction')
    //     ?.valueChanges.pipe(
    //       startWith(this.occupationForm.get('jobFunction')?.value),
    //     ),
    // ]).subscribe(([lgaValue, stationValue, jobFunctionValue]: any) => {
    //   if (lgaValue !== '' && stationValue !== '' && jobFunctionValue !== '') {
    //     this.disableFirstFormBtn = false;
    //   } else {
    //     this.disableFirstFormBtn = true;
    //   }
    // });

    combineLatest([
      this.occupationForm
        .get('lgea')
        ?.valueChanges.pipe(startWith(this.occupationForm.get('lgea')?.value)),
      this.occupationForm
        .get('presentStation')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('presentStation')?.value),
        ),
      this.occupationForm
        .get('jobFunction')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('jobFunction')?.value),
        ),
    ]).subscribe(([lgeaValue, stationValue, jobFunctionValue]: any) => {
      if (lgeaValue !== '' && stationValue !== '' && jobFunctionValue !== '') {
        this.disableFirstFormBtn = false;
      } else {
        this.disableFirstFormBtn = true;
      }
    });

    combineLatest([
      this.occupationForm
        .get('stateMinistryValue')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('stateMinistryValue')?.value),
        ),
      this.occupationForm
        .get('agencyValue')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('agencyValue')?.value),
        ),
      this.occupationForm
        .get('presentStation')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('presentStation')?.value),
        ),
      this.occupationForm
        .get('jobFunction')
        ?.valueChanges.pipe(
          startWith(this.occupationForm.get('jobFunction')?.value),
        ),
    ]).subscribe(
      ([
        stateMinistryValue,
        agencyValue,
        stationValue,
        jobFunctionValue,
      ]: any) => {
        if (
          stateMinistryValue !== '' &&
          agencyValue &&
          stationValue !== '' &&
          jobFunctionValue !== ''
        ) {
          this.disableFirstFormBtn = false;
        } else {
          this.disableFirstFormBtn = true;
        }
      },
    );

    this.occupationForm.get('stateMinistryValue')?.valueChanges.subscribe({
      next: (value: string) => {
        this.beneficiaryService
          .getEnum(endpoints.agencyList + value)
          .subscribe({
            next: (value: any) => {
              this.agencyList = [...this.agencyList, ...value.data];
            },
          });

        this.showAgency = true;
        this.showExtraInput = true;
      },
    });

    this.occupationForm.get('otherOccupation')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value?.length > 1) {
          this.disableBtn = false;
        } else {
          this.disableBtn = true;
        }
      },
    });

    this.occupationForm.get('specifyDiplomaType')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value?.length > 1) {
          this.disableBtn = false;
        } else {
          this.disableBtn = true;
        }
      },
    });

    this.occupationForm.get('psn')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value?.length > 1) {
          this.disableBtn = false;
        } else {
          this.disableBtn = true;
        }
      },
    });

    this.occupationForm.get('diplomaType')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === 'Other') {
          this.showOthers = true;
        } else {
          this.showOthers = true;
        }
      },
    });
  }

  onProceed() {
    this.showNextStep = true;
    this.showCivilServerntsInfo = true;
    this.showAdditionalCivilServiceInfo = false;
    this.showLGA = false;
    this.showLGEA = false;
    this.showExtraInput = false;
    this.showMinitry = false;
    this.showAgency = false;
  }

  //`${parseInt(newDate[0], 10)}/${parseInt(newDate[1], 10)}/${newDate[2]}`;
  datePipe(event: any, dateVariable: any) {
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
    //console.log('formatted date>>', formattedDates); dd/mm/yyyy format
    if (dateVariable === 'dateOfFistAppointment') {
      this.occupationEnums.dateOfFistAppointment = formattedDates;
    } else if (dateVariable === 'dateOfConfirmation') {
      this.occupationEnums.dateOfConfirmation = formattedDates;
    } else if (dateVariable === 'dateOfTransfer') {
      this.occupationEnums.dateOfTransfer = formattedDates;
    }
  }

  checkBox(event: any, checkVariable: any) {
    if (checkVariable === 'leavePaid') {
      this.occupationEnums.leavePaid = event;
    }
  }

  updateDisabledBtn() {
    this.disableBtn = !this.occupationForm.valid;
    this.disableFirstFormBtn = !this.occupationForm.valid;
  }

  //otherOccupation
  submitForm() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const totalPayload: any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      type: this.occupationForm.value.occupation,
      otherOccupationType:
        this.occupationForm.value.occupation === 'Other'
          ? this.occupationForm.get('otherOccupation')?.value
          : null,
      nameOfInstitution: this.occupationForm.value.nameOfInstitution,
      matriculationNumber: this.occupationForm.value.matriculationNumber,
      faculty: this.occupationForm.value.faculty,
      department: this.occupationForm.value.department,
      funding: this.occupationForm.value.funding,
      diplomaType: this.occupationForm.value.diplomaType,
      otherDiplomaType:
        this.occupationForm.value.diplomaType === 'Other'
          ? this.occupationForm.value.specifyDiplomaType
          : null,
      dateOfFistAppointment: this.occupationEnums.dateOfFistAppointment,
      dateOfConfirmation: this.occupationEnums.dateOfConfirmation,
      onTransfer:
        this.occupationForm.value.onTransfer === 'Yes'
          ? true
          : this.occupationForm.value.onTransfer === 'No'
            ? false
            : null,
      dateOfTransfer: this.occupationEnums.dateOfTransfer,
      cadreType: this.occupationForm.value.jobFunction,
      stateMinistry: this.occupationForm.value.stateMinistryValue,
      agency: this.occupationForm.value.agencyValue,
      lga: this.occupationForm.value.lga,
      lgea: this.occupationForm.value.lgea,
      civilServantCategory: this.occupationForm.value.civilServiceCategory,
      presentStation: this.occupationForm.value.presentStation,
      cadre: this.occupationForm.value.cadre,
      highestQualification: this.occupationForm.value.highestQualification,
      gradeLevel: this.occupationForm.value.gradeLevel,
      onStudyLeave:
        this.occupationForm.value.onStudyLeave === 'Yes'
          ? true
          : this.occupationForm.value.onStudyLeave === 'No'
            ? false
            : null,
      leavePaid:
        this.occupationEnums.leavePaid === null
          ? false
          : this.occupationEnums.leavePaid,
      trained:
        this.occupationForm.value.trained === 'Yes'
          ? true
          : this.occupationForm.value.trained === 'No'
            ? false
            : null,
      trainingType: this.occupationForm.value.trainingType,
      professionalQualifications:
        this.occupationEnums.professionalQualifications,
      psn: this.occupationForm.value.psn ?? '',
      tin: this.occupationForm.value.tin ?? '',
    };
    // console.log("totals>>>", totalPayload);
    this.beneficiaryService.occupationDetails(totalPayload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        // console.log("res>>>>", res);
        this.toast.setSuccessMessage(
          'Beneficiary Occupation data is onboarded successfully!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay('other details');
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'other_details',
          },
        });
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
        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      },
    });
  }
}
