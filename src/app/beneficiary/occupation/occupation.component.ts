import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss']
})
export class OccupationComponent implements OnInit {

  options: string[] = [
    "What is your occupation*", "Student", "Civil servant", "Others"
  ];
  option2: string[] = [
    "Other Sources of Income e.g farming business etc*"
  ];
  option3: string[] = [
    "Sponsorship type*", "Self sponsorship", "On scholarship"
  ];
  option4: string[] = [
    "(For diploma students) Diploma type*", "National Diploma", "School Diploma", "Others"
  ];
  option5: string[] = [
    "Are you on transfer?*", "Yes", "No"
  ];
  option6: string[] = [
    "What cadre are you?*", "professional", "executive", "admin"
  ];
  option7: string[] = [
    "On Study Leave?*", "Yes", "No"
  ];
  option8: string[] = [
    "Have you gone on a training before?*", "Yes", "No"
  ];
  option9: string[] = [
    "Local or Foreign?*", "Local", "Foreign"
  ];
  showRetired: boolean = false;
  showSelfEmployed: boolean = false;
  showEmployed: boolean = false;
  occupationForm!: FormGroup;
  userDetails: any = {};
  showSpinner:boolean = false;
  showWelcomeMsg:boolean = false;
  showStudentsInfo:boolean = false;
  showCivilServerntsInfo:boolean = false;
  checked:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ) {
    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    const getMessage:any = sessionStorage.getItem('incomplete');
    if(getMessage !== null){
      this.showWelcomeMsg = true;
       setTimeout(() => {
        this.showWelcomeMsg = false;
        sessionStorage.removeItem('incomplete');
       }, 2500);
    }else{
       this.showWelcomeMsg = false;
    }
  }

  currentWord: string = ''; // Input text
  words: string[] = [];   // Array to hold the words
  currentWordz: string = ''; // Input text
  wordz: string[] = [];   // Array to hold the words

  addWord() {
    if (this.currentWord.trim() !== '') {
      this.words.push(this.currentWord.trim());
      this.currentWord = ''; // Clear the input
    }
    console.log('words array>>>', this.words);
  }

  removeWord(word: string) {
    // Remove the selected word from the array
    this.words = this.words.filter(w => w !== word);
  }

  addWord2() {
    if (this.currentWordz.trim() !== '') {
      this.wordz.push(this.currentWordz.trim());
      this.currentWordz = ''; // Clear the input
    }
    console.log('words array>>>', this.wordz);
  }

  removeWord2(word: string) {
    // Remove the selected word from the array
    this.wordz = this.wordz.filter(w => w !== word);
  }

  ngOnInit(): void {
    this.getEmploymentForm(); 
  }

  getEmploymentForm() {
    this.occupationForm = new FormGroup({
      occupation: new FormControl('', [Validators.required]),
      nameOfEmployer: new FormControl('', [Validators.required]),
      employerOfficeAddress: new FormControl('', [Validators.required]),
      otherSourcesOfIncome: new FormControl('', [Validators.required]),
      nameOfBusiness: new FormControl('', [Validators.required]),
      natureOfBusiness: new FormControl('', [Validators.required]),
      pensionAccount: new FormControl('', [Validators.required]),
      pensionPaymentQuestion: new FormControl('', [Validators.required])
    })

    this.occupationForm.get('occupation')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === "Student") {
          this.showStudentsInfo = true;
          this.showCivilServerntsInfo = false;
        } else if (value === "Civil servant") {
          this.showCivilServerntsInfo = true;
          this.showStudentsInfo = false;
        } 
      }
    })
  }


  submitForm() {
    this.showSpinner = true;
    // const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    this.beneficiaryService.setRouteToDisplay("other details");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'other_details'
      }
    })
  }
}
