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

  options: string[] | any = [
    "Level of Education*","SSCE", "OND", "HND", "B.Sc", "B.Tech", "B.Eng", "MSc", "Phd","Others", "None of the above, others"
  ]

  fundingOptions: string[] |any = [
    "Who is your sponsor?*" , "Parents", "Self-Funded", "Scholarship", "Free Government Support / Subsidized Education"
  ]

  checked:boolean |any = false;
  showOthers:boolean = false;
  educationForm!: FormGroup;
  disableBtn: boolean = true;
  userDetails:any = {};
  showSpinner:boolean = false;
  showWelcomeMsg:boolean = false;
  showOtherLevel: boolean = false;
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

 

  toggleChecked(event:any){
  //  console.log("event>>", event);
    if(event === true){
      this.showOthers = true;
      this.disableBtn = true;
      this.cheeckIfEductionDetailsAreFilled();
    }else{
      this.showOthers = false; 
      this.disableBtn = true;
    }
  }


  cheeckIfEductionDetailsAreFilled(){
    if( this.showOthers === true && this.educationForm?.get('funding')?.value?.length === 0){
      this.toast.setSuccessMessage("Educational Funding is required");
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    }else if(this.showOthers === true && this.educationForm?.get('currentLevel')?.value?.length === 0){
      this.toast.setSuccessMessage("Educational Current Level is required");
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
    }else{
      this.disableBtn = false;
    }

  }


  

getDropDownTypes(){
  this.beneficiaryService.getEducationDropdown().subscribe({
    next: (item: any) => {
      this.options = new Set(["Level of Education*","SSCE", "OND", "HND", "B.Sc", "B.Tech", "B.Eng", "MSc", "Phd","Others", "None of the above, others"].concat(item.data));
    }
  })


  this.beneficiaryService.getEducationSponsorDropdown().subscribe({
    next: (item: any) => {
      this.fundingOptions = new Set(["Who is your sponsor?*" , "Parents", "Self-Funded", "Scholarship", "Free Government Support / Subsidized Education"].concat(item.data));
    }
  })
}


  ngOnInit(): void {
    this.getEduForm();
    this.getDropDownTypes();
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
      otherLevel:  new FormControl('', [Validators.required])
    })

    this.educationForm.get('tertiaryInstitutionLocation')?.valueChanges.subscribe({
      next: (value:any) => {
        this.disableBtn = false;
      }
    })


    this.educationForm.get('funding')?.valueChanges?.subscribe({
      next: (value:any) => {
        if(value?.length > 1){
          this.disableBtn = false;
        }
      }
    });

    this.educationForm.get('eduLevel')?.valueChanges.subscribe({
      next: (value: any) => {
        if(value === "Others" || value === "None of the above, others"){
          this.showOtherLevel = true;
        }else{
          this.showOtherLevel = false;
        }
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
    const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    const payload = {
      phoneNumber:getBeneficiaryPhoneNumber ,
      level: this.educationForm.value?.eduLevel,
      otherLevel: this.educationForm.value?.eduLevel === 'Others' ? this.educationForm.value?.otherLevel: this.educationForm.value?.eduLevel === 'None of the above, others' ? this.educationForm.value?.otherLevel : null,
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

    this.beneficiaryService.educationDetails(payload).subscribe({
      next: (res:any) => {
        //console.log("res>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Education data onboarded successfully!');
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
