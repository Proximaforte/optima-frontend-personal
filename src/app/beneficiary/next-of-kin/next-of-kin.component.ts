import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.component.html',
  styleUrls: ['./next-of-kin.component.scss']
})
export class NextOfKinComponent implements OnInit {

  options: string[] = ["State of residence"];
  option2: string[] = ["Local government of residence"];
  nextOfKinForm!: FormGroup;
  sameResidence: boolean = false;
  checked: boolean | any = false;
  option5: string[] = [
    "Relationship*", "FATHER", "MOTHER", "SPOUSE", "CHILD", "GRAND_PARENT", "GRAND_SPOUSE", "Others"
  ];
  showOthers: boolean = false;
  userDetails: any = {};
  disableBtn: boolean = true;
  showSpinner: boolean = false;

  showWelcomeMsg:boolean = false;
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



  toggleChecked(event: any) {
    this.disableBtn = false;
    if (event === true) {
      this.sameResidence = true;
    } else {
      this.sameResidence = false;
    }
  }

  getNextOfKinForm() {
    this.nextOfKinForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      nin: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      ssid: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
      specifyRelationship: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    })

    this.nextOfKinForm.get('relationship')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value === 'Others') {
          this.showOthers = true;
        } else {
          this.showOthers = false;
        }
      }
    })


    this.nextOfKinForm.get('address')?.valueChanges.subscribe({
      next: (value: any) => {
        this.disableBtn = false;
      }

    })
  }

  ngOnInit(): void {
    this.getNextOfKinForm();
  }

  submit() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    const payload = {
      beneficiaryPhoneNumber: this.userDetails?.phoneNumber,
      firstname: this.nextOfKinForm.value?.firstname,
      lastname: this.nextOfKinForm.value?.lastname,
      relationship: this.nextOfKinForm.value.relationship === 'Others' ? this.nextOfKinForm.value?.specifyRelationship : this.nextOfKinForm.value.relationship,
      nin: this.nextOfKinForm.value?.nin,
      nokSsid: this.nextOfKinForm.value?.ssid,
      phoneNumber: getBeneficiaryPhoneNumber,
      email: this.nextOfKinForm.value?.email,
      address: this.sameResidence === true ? this.userDetails?.address : this.nextOfKinForm.value?.address
    }

    // console.log("payload>>", payload);
    this.beneficiaryService.nextOfKinDetails(payload).subscribe({
      next: (res: any) => {
       // console.log("res>>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Next of Kin data onboarded succesfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("employment");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'employment'
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
        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      }
    })
  }

}
