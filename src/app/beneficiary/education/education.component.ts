import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  options: string[] = [
    "Level of Education*","SSCE", "OND", "HND", "B.Sc", "B.Tech", "B.Eng", "MSc", "Phd","Others", "None of the above, others"
  ]

  fundingOptions: string[] = [
    "Who is your sponsor?*" , "Parents", "Self-Funded", "Scholarship", "Free Government Support / Subsidized Education"
  ]

  checked:boolean |any = false;
  showOthers:boolean = false;
  educationForm!: FormGroup;
  disableBtn: boolean = true;
  userDetails:any = {};
  showSpinner:boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
     this.userDetails = JSON.parse(getUserData);
  }

 

  toggleChecked(event:any){
  //  console.log("event>>", event);
    if(event === true){
      this.showOthers = true;
    }else{
      this.showOthers = false; 
    }
  }


  ngOnInit(): void {
    this.getEduForm();
  }

  getEduForm(){
    this.educationForm = new FormGroup({
      eduLevel: new FormControl('', [Validators.required]),
      certifications: new FormControl('', [Validators.required]),
      primarySchAttended: new FormControl('', [Validators.required]),
      primarySchLocation: new FormControl('', [Validators.required]),
      secSchAttended: new FormControl('', [Validators.required]),
      secSchLocation: new FormControl('', [Validators.required]),
      tertiaryInstitutionAttended: new FormControl('', [Validators.required]),
      tertiaryInstitutionLocation: new FormControl('', [Validators.required]),
      currentLevel: new FormControl('', [Validators.required]),
      funding: new FormControl('', [Validators.required]),
    })

    this.educationForm.get('tertiaryInstitutionLocation')?.valueChanges.subscribe({
      next: (value:any) => {
        this.disableBtn = false;
      }
    })
  }


  skip(){
    this.beneficiaryService.setRouteToDisplay("health");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'health'
      }
    })
  }

  submit(){
    this.showSpinner = true;
    const payload = {
      phoneNumber: this.userDetails?.phoneNumber,
      level: this.educationForm.value?.eduLevel,
      certification: this.educationForm.value?.certifications,
      primarySchool: this.educationForm.value?.primarySchAttended,
      primarySchoolAddress: this.educationForm.value?.primarySchLocation,
      secondarySchool: this.educationForm.value?.secSchAttended,
      secondarySchoolAddress: this.educationForm.value?.secSchLocation,
      tertiarySchool: this.educationForm.value?.tertiaryInstitutionAttended,
      tertiarySchoolAddress: this.educationForm.value?.tertiaryInstitutionLocation,
      inSchool: this.showOthers,
      currentLevel: this.educationForm.value?.currentLevel,
      funding: this.educationForm.value?.funding
    }

   // console.log('payload>>>', payload);
    this.beneficiaryService.educationDetails(payload).subscribe({
      next: (res:any) => {
        console.log("res>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Education data onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("health");
        this.router.navigate(['/home/beneficiary'],{
          relativeTo: this.route,
          queryParams: {
            progress: 'health'
          }
        })
      },
      error: (err:any) => {
        console.error("err>>>", err);
        this.showSpinner = false;
        this.toast.setErrorMessage( err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });

        if(err?.status === 401){
          this.auth.agentLogout();
          }
      }
    });
  }
}
