import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Occupation } from 'src/app/models/beneficiary/beneficiary';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { combineLatest, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss'],
})
export class OccupationComponent implements OnInit, OnDestroy {
  civilServiceCategoryOptions: string[] = [];
  nameOfInstitutions: string[] = [];
  state: string = 'kwara';
  publicServiceCategoryOptions: string[] = [];
  pensionTypesOptions: any;

  indigeneCategoryOptions: string[] = ['Yes', 'No'];

  // newly added for students

  schoolCategories: string[] = [];
  showTertiary: boolean = false;
  showSecondarySchoolDepartment: boolean = false;
  secondarySchoolDepartmentType: string[] = [];


 
 

  //end of newly added for student
 
  option2: string[] = ['Other Sources of Income e.g farming business etc*'];
  option3: string[] | any = [
  
    'Parents',
    'Self-Funded',
    'Scholarship',
    'Free Government Support / Subsidized Education',
  ];
  option4: string[] | any = [
  
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
  stateMinistries: string[] = [''];
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
  showPublicServant: boolean = false;
  showPensioner: boolean = false;
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
  occupationTypes: any[] = [];
  scaleOfTrade: any;
  BusinessDuration: any;
  interventionNature: any;
  interventionLevel: any;
  institutionOwnership: any;
  numberOfPublications: any;
  academicsYearOfExperience: any;
  academicsHighestLevelOfEducation: any;
  clergyFaith: any;
  clergyMembershipCount: any;
  securityOutfitType: any;
  securityDutyPost: any;
  showTraders: boolean = false;
  showArtisan: boolean = false;
  showAcademics: boolean = false;
  showClergy: boolean = false;
  showSecurityAgencies: boolean = false;
  alternateText: string = '';

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
    dateOfRetirement: '',
    professionalQualifications: [
      //
      '',
    ],
    psn: '',
  };
  private specifyDiplomaTypeSubscription?: Subscription;
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

  get shouldShowNonTertiaryInputs(): boolean {
    const category = this.occupationForm.get('schoolCategory')?.value;
    return category && category !== 'Tertiary Institution';
  }


  currentWord: string = '';
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
  yearRangeValidator: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const admission = group.get('admissionYear');
    const graduation = group.get('graduationYear');

    if (!admission?.value || !graduation?.value) return null;

    const admissionYear = +admission.value;
    const graduationYear = +graduation.value;

    if (admissionYear > graduationYear) {
      graduation.setErrors({ graduationBeforeAdmission: true });
      return { graduationBeforeAdmission: true };
    } else {
      graduation.setErrors(null);
      return null;
    }
  };

  getMinGraduationDate(): string | null {
    const admission = this.occupationForm.get('admissionYear')?.value;
    if (!admission) return null;
  
    const minDate = new Date(admission);
    minDate.setFullYear(minDate.getFullYear() + 1);
    return minDate.toISOString().split('T')[0]; // formats as "YYYY-MM-DD"
  }

  getMaxAdmissionDate(): string | null {
    const graduation = this.occupationForm.get('graduationYear')?.value;
    if (!graduation) return null;
  
    const maxDate = new Date(graduation);
    maxDate.setFullYear(maxDate.getFullYear() - 1);
    return maxDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  }
  

  dateRangeValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');

    if (!start?.value || !end?.value) return null;

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);

    if (startDate > endDate) {
      end?.setErrors({ endBeforeStart: true });
      return { endBeforeStart: true };
    } else {
      end?.setErrors(null);
      return null;
    }
  };
  
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
           
            'National Diploma',
            'School Diploma',
          ].concat(item.data),
        );
      },
    });

    this.beneficiaryService.getPublicServantCategory().subscribe({
      next: (item: any) => {
        this.publicServiceCategoryOptions = item.data;
      },
    });
    this.beneficiaryService.getPensionTypes().subscribe({
      next: (item: any) => {
        this.pensionTypesOptions = item.data;
      },
    });
    this.beneficiaryService.getInstitutions(this.state).subscribe({
      next: (item: any) => {
        this.nameOfInstitutions = item.data;
      },
    });


    //newly added for students
    this.beneficiaryService.getSchoolCategories().subscribe({
      next: (item: any) => {
        this.schoolCategories = item.data;
      },
    });

    this.beneficiaryService.getSecondarySchoolDepartmentType().subscribe({
      next: (item: any) => {
        this.secondarySchoolDepartmentType = item.data;
      },
    });


    //end of newly added for students


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
    this.beneficiaryService.getEnum(endpoints.scaleOfTrade).subscribe({
      next: (item: any) => {
        this.scaleOfTrade = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.timeInBusiness).subscribe({
      next: (item: any) => {
        this.BusinessDuration = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.InterventionTypes).subscribe({
      next: (item: any) => {
        this.interventionNature = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.InterventionLevel).subscribe({
      next: (item: any) => {
        this.interventionLevel = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.education).subscribe({
      next: (item: any) => {
        this.option10 = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.institutionOwnership).subscribe({
      next: (item: any) => {
        this.institutionOwnership = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.numberOfPublications).subscribe({
      next: (item: any) => {
        this.numberOfPublications = item.data;
      },
    });
    this.beneficiaryService
      .getEnum(endpoints.academicsYearOfExperience)
      .subscribe({
        next: (item: any) => {
          this.academicsYearOfExperience = item.data;
        },
      });
    this.beneficiaryService
      .getEnum(endpoints.academicsHighestLevelOfEducation)
      .subscribe({
        next: (item: any) => {
          this.academicsHighestLevelOfEducation = item.data;
        },
      });
    this.beneficiaryService.getEnum(endpoints.clergyFaith).subscribe({
      next: (item: any) => {
        this.clergyFaith = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.clergyMembershipCount).subscribe({
      next: (item: any) => {
        this.clergyMembershipCount = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.securityOutfitType).subscribe({
      next: (item: any) => {
        this.securityOutfitType = item.data;
      },
    });
    this.beneficiaryService.getEnum(endpoints.securityDutyPost).subscribe({
      next: (item: any) => {
        this.securityDutyPost = item.data;
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

    this.beneficiaryService.getOccupationTypes().subscribe({
      next: (item: any) => {
        this.occupationTypes = item.data;
      },
    });
  }

  ngOnInit(): void {
    this.getEmploymentForm();
    this.getDropdownItems();
   
    this.occupationForm.statusChanges.subscribe(status => {
      console.log('Form status:', status); // VALID or INVALID
      console.log('Form validity:', this.occupationForm.valid); // true or false
    });
    

    
  }



  getEmploymentForm() {
    this.occupationForm = new FormGroup({
      occupation: new FormControl('', [Validators.required]),
     nameOfInstitution: new FormControl('', [Validators.required]),
      matriculationNumber: new FormControl('', [Validators.required]),
      admissionYear: new FormControl('', [Validators.required]),
      graduationYear: new FormControl('', [Validators.required]),
      courseOfStudy: new FormControl('', [Validators.required]),
      indigene: new FormControl('', [Validators.required]),
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
      publicServiceCategory: new FormControl('', [Validators.required]),
      onTransfer: new FormControl('', [Validators.required]),
      cadre: new FormControl('', [Validators.required]),
      highestQualification: new FormControl('', [Validators.required]),
      gradeLevel: new FormControl('', [Validators.required]),
      onStudyLeave: new FormControl('', [Validators.required]),
      trained: new FormControl('', [Validators.required]),
      trainingType: new FormControl('', [Validators.required]),
      psn: new FormControl('', [Validators.required]),
      tin: new FormControl('', [Validators.required]),
      pensionType: new FormControl('', [Validators.required]),
      gradeLevelOfRetirement: new FormControl('', [Validators.required]),
      dateOfRetirement: new FormControl('', [Validators.required]),
      lastMDAsOfRetirement: new FormControl('', [Validators.required]),
      ministries: new FormControl('', [Validators.required]),
      pensionVerificationNumber: new FormControl('', [Validators.required]),

      scaleOfTrade: new FormControl('', [Validators.required]),
      natureOfBusiness: new FormControl('', [Validators.required]),
      durationInBusiness: new FormControl('', [Validators.required]),
      enjoyedIntervention: new FormControl('', [Validators.required]),
      InterventionTypes: new FormControl('', [Validators.required]),
      InterventionLevel: new FormControl('', [Validators.required]),
      artisanEducation: new FormControl('', [Validators.required]),
      institutionOwnership: new FormControl('', [Validators.required]),
      numberOfPublications: new FormControl('', [Validators.required]),
      areaofSpecialization: new FormControl('', [Validators.required]),
      academicsYearOfExperience: new FormControl('', [Validators.required]),
      academicsHighestLevelOfEducation: new FormControl('', [
        Validators.required,
      ]),
      clergyFaith: new FormControl('', [Validators.required]),
      founder: new FormControl('', [Validators.required]),
      clergyMembershipCount: new FormControl('', [Validators.required]),
      securityOutfitType: new FormControl('', [Validators.required]),
      otherSecurityOutfitType: new FormControl('', [Validators.required]),
      securityDutyPost: new FormControl('', [Validators.required]),
      serviceNumber: new FormControl('', [Validators.required]),
      rank: new FormControl('', [Validators.required]),
      otherQualification: new FormControl(''),


      //newly added for students

      schoolName: new FormControl('', [Validators.required]),
      schoolCategory: new FormControl('', [Validators.required]),
      secondarySchoolDepartment: new FormControl('', [Validators.required]),
      hasEnjoyedGovtAssistance: new FormControl('', [Validators.required]),



      //end of newly added for students

    });

    

    this.occupationForm.get('occupation')?.valueChanges.subscribe({
      next: (value: any) => {
        // Reset all visibility flags to false
        this.showStudentsInfo = false;
        this.showCivilServerntsInfo = false;
        this.showOtherzz = false;
        this.showPublicServant = false;
        this.showAdditionalCivilServiceInfo = false;
        this.showLGEA = false;
        this.showLGA = false;
        this.showMinitry = false;
        this.showExtraInput = false;
        this.showPensioner = false;
        this.showTraders = false;
        this.showArtisan = false;
        this.showAcademics = false;
        this.showClergy = false;
        this.showSecurityAgencies = false;
        this.showTertiary = false;
        if (this.occupationForm.get('artisanEducation')?.value === 'yes') {
          this.occupationForm.get('highestQualification')?.reset();
          this.occupationForm.get('highestQualification')?.setErrors(null);
        }
        if (this.occupationForm.get('founder')?.value === 'yes') {
          this.occupationForm.get('clergyMembershipCount')?.reset();
          this.occupationForm.get('clergyMembershipCount')?.setErrors(null);
        }
        if (this.occupationForm.get('securityOutfitType')?.value === 'Others') {
          this.occupationForm.get('otherSecurityOutfitType')?.reset();
          this.occupationForm.get('otherSecurityOutfitType')?.setErrors(null);
        }
        if (
          this.occupationForm.get('highestQualification')?.value ===
          'None of the above, others'
        ) {
          this.occupationForm.get('otherQualification')?.reset();
          this.occupationForm.get('otherQualification')?.setErrors(null);
        }

        // Set specific flags based on the selected occupation
        switch (value) {
          case 'Student':
            this.showStudentsInfo = true;

            break;
          case 'Civil servant':
            this.showAdditionalCivilServiceInfo = true;
            break;
          case 'Public servant':
            this.showPublicServant = true;
            break;
          case 'Pensioner':
            this.showPensioner = true;
            break;
          case 'Trader':
            this.showTraders = true;
            this.alternateText = 'Business';
            break;
          case 'Artisan':
            this.showArtisan = true;
            this.alternateText = 'Trade/ Service';
            break;
          case 'Academics':
            this.showAcademics = true;
            break;
          case 'Clergy':
            this.showClergy = true;
            this.alternateText = 'Denomination/ Society';
            break;
          case 'Security Agencies':
            this.showSecurityAgencies = true;

            break;
          case 'Other':
            this.showOtherzz = true;
            break;
        }
      },
    });

    //newly added for student

    

    this.occupationForm.get('schoolCategory')?.valueChanges.subscribe(value => {
      // console.log('Selected school category:', value);

      
      
      if(value === "Tertiary Institution"){
        this.showTertiary = true;
        this.showSecondarySchoolDepartment = false;

        combineLatest([
          this.occupationForm.get('nameOfInstitution')!.valueChanges,
         
          this.occupationForm.get('matriculationNumber')!.valueChanges,
          this.occupationForm.get('admissionYear')!.valueChanges,
          this.occupationForm.get('graduationYear')!.valueChanges,
          this.occupationForm.get('faculty')!.valueChanges,
          this.occupationForm.get('courseOfStudy')!.valueChanges,
          this.occupationForm.get('department')!.valueChanges,
          this.occupationForm.get('funding')!.valueChanges,
          this.occupationForm.get('indigene')!.valueChanges,
          this.occupationForm.get('hasEnjoyedGovtAssistance')!.valueChanges,
          this.occupationForm.get('diplomaType')!.valueChanges,
        ]).subscribe(([nameOfInstitution, matriculationNumber, admissionYear, graduationYear, faculty, courseOfStudy, department, funding, indigene, hasEnjoyedGovtAssistance, diplomaType]) => {
          this.disableBtn = !(
            nameOfInstitution &&
            matriculationNumber &&
            admissionYear &&
            graduationYear &&
            faculty &&
            courseOfStudy &&
            department &&
            funding &&
            indigene &&
            hasEnjoyedGovtAssistance &&
            diplomaType
          );
        });
      }

      else if(value === "Senior Secondary"){
        this.showSecondarySchoolDepartment = true;
        combineLatest([
          this.occupationForm.get('schoolName')!.valueChanges,
          this.occupationForm.get('admissionYear')!.valueChanges,
          this.occupationForm.get('graduationYear')!.valueChanges,
          this.occupationForm.get('funding')!.valueChanges,
          this.occupationForm.get('indigene')!.valueChanges,
          this.occupationForm.get('secondarySchoolDepartment')!.valueChanges,
          this.occupationForm.get('hasEnjoyedGovtAssistance')!.valueChanges,
        ]).subscribe(([schoolName, admission, graduation, funding, indigene, secondarySchoolDepartment, hasEnjoyedGovtAssistance]) => {
          this.disableBtn = !(
            schoolName &&
            admission &&
            graduation &&
            funding &&
            indigene &&
            secondarySchoolDepartment &&
            hasEnjoyedGovtAssistance
          );
        });
      }
      else{
        this.showTertiary = false;
       this.showSecondarySchoolDepartment = false;

        combineLatest([
          this.occupationForm.get('schoolName')!.valueChanges,
          this.occupationForm.get('admissionYear')!.valueChanges,
          this.occupationForm.get('graduationYear')!.valueChanges,
          this.occupationForm.get('funding')!.valueChanges,
          this.occupationForm.get('indigene')!.valueChanges,
          this.occupationForm.get('hasEnjoyedGovtAssistance')!.valueChanges,
        ]).subscribe(([schoolName, admission, graduation, funding, indigene, hasEnjoyedGovtAssistance]) => {

          
          this.disableBtn = !(
            schoolName &&
            admission &&
            graduation &&
            funding &&
            indigene &&
            hasEnjoyedGovtAssistance
          );
        });
       
      }

      
    });


    //end of newly added for student
    


    this.occupationForm.get('civilServiceCategory')?.valueChanges.subscribe({
      next: (value: string) => {
        if (
          value.toUpperCase() === 'TESCOM' ||
          value.toUpperCase() === 'LOCAL GOVERNMENT'
        ) {
          this.occupationForm.get('presentStation')?.reset();
          this.occupationForm.get('jobFunction')?.reset();
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
          this.disableFirstFormBtn = true;
        } else if (value.toUpperCase() === 'STATE MINISTRY') {
          this.showMinitry = true;
          this.showLGEA = false;
          this.showLGA = false;
          this.showExtraInput = true;
          this.disableFirstFormBtn = true;
        } else if (
          value === 'LEGISLATIVE' ||
          value === 'JUDICIARY' ||
          value === 'EXECUTIVE'
        ) {
          this.showLGEA = false;
          this.showLGA = false;
          this.showMinitry = false;
          this.showMinitry = false;
          this.showLGEA = false;
          this.showLGA = false;
          this.showExtraInput = false;
          this.disableFirstFormBtn = true;
        }
      },
    });
    this.occupationForm.get('publicServiceCategory')?.valueChanges.subscribe({
      next: (value: string) => {
        if (
          value === 'LEGISLATIVE' ||
          value === 'JUDICIARY' ||
          value === 'EXECUTIVE'
        ) {
          this.disableBtn = false;
          this.showMinitry = false;
          this.showLGEA = false;
          this.showLGA = false;
          this.showExtraInput = false;
          this.disableFirstFormBtn = true;
        }
      },
    });

    this.occupationForm.get('lga')?.valueChanges.subscribe({
      next: (value: string) => {
        if (value !== '') {
          this.occupationForm.get('presentStation')?.valueChanges.subscribe({
            next: (value2: string) => {
              if (value2 !== '') {
                this.occupationForm.get('jobFunction')?.valueChanges.subscribe({
                  next: (value3: string) => {
                    if (value3 !== '') {
                      this.disableFirstFormBtn = false;
                    }
                  },
                });
              }
            },
          });
        }
      },
    });

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

    this.occupationForm.get('psn')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value?.length > 1) {
          this.disableBtn = false;
        } else {
          this.disableBtn = true;
        }
      },
    });

    // Class-level subscription to clean up later

    this.occupationForm.get('diplomaType')?.valueChanges.subscribe({
      next: (value: any) => {
        const diplomaTypeControl = this.occupationForm.get('diplomaType');
        const specifyDiplomaControl =
          this.occupationForm.get('specifyDiplomaType');

        if (value === 'Other') {
          this.showOthers = true;
          diplomaTypeControl?.setValidators(Validators.required);

          // Unsubscribe from previous subscription if exists
          this.specifyDiplomaTypeSubscription?.unsubscribe();

          // Subscribe to specifyDiplomaType value changes
          this.specifyDiplomaTypeSubscription =
            specifyDiplomaControl?.valueChanges.subscribe({
              next: (specifyValue: any) => {
                this.disableBtn = !(specifyValue?.length > 1);
              },
            });
        } else {
          this.showOthers = false;
          diplomaTypeControl?.clearValidators();
          // this.disableBtn = false;

          // Cleanup the previous subscription
          this.specifyDiplomaTypeSubscription?.unsubscribe();
        }

        diplomaTypeControl?.updateValueAndValidity();
      },
    });
  }

  ngOnDestroy(): void {
    this.specifyDiplomaTypeSubscription?.unsubscribe();
  }

  get psn() {
    return this.occupationForm.get('pensionVerificationNumber');
  }

  get pensionerType() {
    return this.occupationForm.get('pensionType');
  }

  get gradeLevelOfRetirement() {
    return this.occupationForm.get('gradeLevelOfRetirement');
  }

  get dateOfRetirement() {
    return this.occupationForm.get('dateOfRetirement');
  }

  get lastMDAsOfRetirement() {
    return this.occupationForm.get('lastMDAsOfRetirement');
  }
  get type() {
    return this.occupationForm.get('occupation');
  }
  get ministries() {
    return this.occupationForm.get('ministries');
  }
  onProceed() {
    if (this.showPublicServant) {
      this.showNextStep = false;
      this.showCivilServerntsInfo = true;
      this.showPublicServant = false;
    } else if (this.showPensioner) {
      this.showNextStep = false;
      this.showCivilServerntsInfo = false;
      this.disableBtn = true;
      this.showPublicServant = false;
    } else {
      this.showNextStep = true;
      this.showCivilServerntsInfo = true;
    }

    this.showAdditionalCivilServiceInfo = false;
    this.showLGA = false;
    this.showLGEA = false;
    this.showExtraInput = false;
    this.showMinitry = false;
    this.showAgency = false;
  }

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
      console.log('yes');

      this.occupationEnums.dateOfFistAppointment = formattedDates;
    } else if (dateVariable === 'dateOfConfirmation') {
      this.occupationEnums.dateOfConfirmation = formattedDates;
    } else if (dateVariable === 'dateOfTransfer') {
      this.occupationEnums.dateOfTransfer = formattedDates;
    } else if (dateVariable === 'dateOfRetirement') {
      console.log('yes');

      this.occupationEnums.dateOfRetirement = formattedDates;
    }
  }

  checkBox(event: any, checkVariable: any) {
    if (checkVariable === 'leavePaid') {
      this.occupationEnums.leavePaid = event;
    }
  }

  // updateDisabledBtn() {
  //   this.disableBtn = !this.occupationForm.valid;
  //   this.disableFirstFormBtn = !this.occupationForm.valid;
  // }

  //otherOccupation
  submitForm() {


  // Check if form is valid
  // if (this.occupationForm.invalid) {
  //   console.log('Form is invalid', this.occupationForm.errors);
  //   return;
  // }



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
      department: this.occupationForm.value.schoolCategory === 'Tertiary Institution' ? this.occupationForm.value.department + " department" : this.occupationForm.value.department,
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
      publicServiceCategory: this.occupationForm.value.publicServiceCategory,
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
      pensionerType: 'string',
      gradeLevelOfRetirement: 'string',
      dateOfRetirement: 'string',
      lastMDAsOfRetirement: 'string',
      isIndigene: this.occupationForm.value.indigene === 'Yes' ? true : false,
      courseOfStudy: this.occupationForm.value.courseOfStudy,
      yearOfAdmission: this.occupationForm.value.admissionYear.split('-')[0],
      expectedYearOfGraduation:
        this.occupationForm.value.graduationYear.split('-')[0],

        //newly added for students

        schoolCategory: this.occupationForm.value.schoolCategory,
        schoolName: this.occupationForm.value.schoolName,
        secondarySchoolDepartment: this.occupationForm.value.secondarySchoolDepartment,
        hasEnjoyedGovtAssistance: this.occupationForm.value.hasEnjoyedGovtAssistance === 'Yes' ? true : false,


        //end of newly added for students
    };

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
  isSubmitButtonEnabled(): boolean {
    return (
      this.psn?.valid ??
      (false && this.pensionerType?.valid) ??
      (false && this.gradeLevelOfRetirement?.valid) ??
      (false && this.dateOfRetirement?.valid) ??
      (false && this.lastMDAsOfRetirement?.valid) ??
      (false && this.type?.valid) ??
      (false && this.ministries?.valid) ??
      false
    );
  }

  submitPension() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const totalPayload: any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      pensionVerificationNumber:
        this.occupationForm.value.pensionVerificationNumber ?? '',
      type: this.occupationForm.value.occupation,
      pensionerType: this.occupationForm.value.pensionType,
      gradeLevelOfRetirement: this.occupationForm.value.gradeLevelOfRetirement,
      dateOfRetirement: this.occupationEnums.dateOfRetirement,
      lastMDAsOfRetirement: this.occupationForm.value.ministries,

      dateOfFistAppointment: this.occupationEnums.dateOfFistAppointment,
    };
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

  traderValid(): boolean {
    const enjoyedIntervention =
      this.occupationForm.get('enjoyedIntervention')?.value === 'yes';

    return (
      (this.occupationForm.get('scaleOfTrade')?.valid ?? false) &&
      (this.occupationForm.get('natureOfBusiness')?.valid ?? false) &&
      (this.occupationForm.get('durationInBusiness')?.valid ?? false) &&
      (this.occupationForm.get('enjoyedIntervention')?.valid ?? false) &&
      (!enjoyedIntervention ||
        ((this.occupationForm.get('InterventionTypes')?.valid ?? false) &&
          (this.occupationForm.get('InterventionLevel')?.valid ?? false)))
    );
  }

  artisanValid(): boolean {
    return (
      (this.occupationForm.get('natureOfBusiness')?.valid ?? false) &&
      (this.occupationForm.get('durationInBusiness')?.valid ?? false) &&
      (this.occupationForm.get('artisanEducation')?.valid ?? false)
    );
  }
  academicValid(): boolean {
    const enjoyedIntervention =
      this.occupationForm.get('enjoyedIntervention')?.value === 'yes';
    return (
      (this.occupationForm.get('academicsHighestLevelOfEducation')?.valid ??
        false) &&
      (this.occupationForm.get('nameOfInstitution')?.valid ?? false) &&
      (this.occupationForm.get('institutionOwnership')?.valid ?? false) &&
      (this.occupationForm.get('numberOfPublications')?.valid ?? false) &&
      (this.occupationForm.get('enjoyedIntervention')?.valid ?? false) &&
      (!enjoyedIntervention ||
        (this.occupationForm.get('InterventionLevel')?.valid ?? false)) &&
      (this.occupationForm.get('areaofSpecialization')?.valid ?? false) &&
      (this.occupationForm.get('academicsYearOfExperience')?.valid ?? false)
    );
  }

  clergyValid(): boolean {
    const enjoyedIntervention =
      this.occupationForm.get('enjoyedIntervention')?.value === 'yes';
    const founder = this.occupationForm.get('founder')?.value === 'yes';

    return (
      (this.occupationForm.get('clergyFaith')?.valid ?? false) &&
      (this.occupationForm.get('natureOfBusiness')?.valid ?? false) &&
      (this.occupationForm.get('founder')?.valid ?? false) &&
      (!founder ||
        (this.occupationForm.get('clergyMembershipCount')?.valid ?? false)) &&
      (this.occupationForm.get('enjoyedIntervention')?.valid ?? false) &&
      (!enjoyedIntervention ||
        ((this.occupationForm.get('InterventionTypes')?.valid ?? false) &&
          (this.occupationForm.get('InterventionLevel')?.valid ?? false)))
    );
  }

  securityValid(): boolean {
    const form = this.occupationForm;
    const isOthersSelected = form.get('securityDutyPost')?.value === 'Others';

    const outfitTypeValid = form.get('securityOutfitType')?.valid ?? false;
    const dutyPostValid = form.get('securityDutyPost')?.valid ?? false;
    const otherOutfitTypeValid = isOthersSelected
      ? form.get('otherSecurityOutfitType')?.valid ?? false
      : true;
    const serviceNumberValid = form.get('serviceNumber')?.valid ?? false;
    const rankValid = form.get('rank')?.valid ?? false;
    const qualificationValid = form.get('highestQualification')?.valid ?? false;

    return (
      outfitTypeValid &&
      dutyPostValid &&
      otherOutfitTypeValid &&
      serviceNumberValid &&
      rankValid &&
      qualificationValid
    );
  }

  submitTrade() {
    this.showSpinner = true;

    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    let totalPayload: any;

    if (this.occupationForm.value.occupation === 'Trader') {
      totalPayload = {
        phoneNumber: getBeneficiaryPhoneNumber,
        type: this.occupationForm.value.occupation,
        scaleOfTrade: this.occupationForm.value.scaleOfTrade,
        natureOfBusiness: this.occupationForm.value.natureOfBusiness,
        timeInBusiness: this.occupationForm.value.durationInBusiness,
        hasEnjoyedGovtIntervention:
          this.occupationForm.value.enjoyedIntervention === 'yes'
            ? true
            : false,
        natureOfIntervention: this.occupationForm.value.InterventionTypes,
        interventionImpactLevel: this.occupationForm.value.InterventionLevel,
      };
    } else if (this.occupationForm.value.occupation === 'Artisan') {
      totalPayload = {
        phoneNumber: getBeneficiaryPhoneNumber,
        type: this.occupationForm.value.occupation,
        natureOfBusiness: this.occupationForm.value.natureOfBusiness,
        timeInBusiness: this.occupationForm.value.durationInBusiness,
        formalEducation:
          this.occupationForm.value.artisanEducation === 'yes' ? true : false,
        highestQualification: this.occupationForm.value.highestQualification,
        otherQualification: this.occupationForm.value.otherQualification,
      };
    } else if (this.occupationForm.value.occupation === 'Academics') {
      totalPayload = {
        phoneNumber: getBeneficiaryPhoneNumber,
        type: this.occupationForm.value.occupation,
        highestQualification:
          this.occupationForm.value.academicsHighestLevelOfEducation,
        presentInstitution: this.occupationForm.value.nameOfInstitution,
        institutionOwnership: this.occupationForm.value.institutionOwnership,
        totalNumberOfPublications:
          this.occupationForm.value.numberOfPublications,
        hasEnjoyedGovtIntervention:
          this.occupationForm.value.enjoyedIntervention === 'yes'
            ? true
            : false,
        interventionImpactLevel: this.occupationForm.value.InterventionLevel,
        areaOfSpecialization: this.occupationForm.value.areaofSpecialization,
        yearsOfExperience: this.occupationForm.value.academicsYearOfExperience,
      };
    } else if (this.occupationForm.value.occupation === 'Clergy') {
      totalPayload = {
        phoneNumber: getBeneficiaryPhoneNumber,
        type: this.occupationForm.value.occupation,
        faith: this.occupationForm.value.clergyFaith,
        denomination: this.occupationForm.value.natureOfBusiness,
        founder: this.occupationForm.value.founder === 'yes' ? true : false,
        hasEnjoyedGovtIntervention:
          this.occupationForm.value.enjoyedIntervention === 'yes'
            ? true
            : false,
        natureOfIntervention: this.occupationForm.value.InterventionTypes,
        interventionImpactLevel: this.occupationForm.value.InterventionLevel,
        membershipSize: this.occupationForm.value.clergyMembershipCount,
      };
    } else if (this.occupationForm.value.occupation === 'Security Agencies') {
      totalPayload = {
        phoneNumber: getBeneficiaryPhoneNumber,
        type: this.occupationForm.value.occupation,
        outfitType: this.occupationForm.value.securityOutfitType,
        dutyPost: this.occupationForm.value.securityDutyPost,
        serviceNo: this.occupationForm.value.serviceNumber,
        rank: this.occupationForm.value.rank,
        otherSecurityOutfitType:
          this.occupationForm.value.otherSecurityOutfitType,
        highestQualification: this.occupationForm.value.highestQualification,
        otherQualification: this.occupationForm.value.otherQualification,
      };
    }
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
