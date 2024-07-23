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
  option5: string[] | any = [
    "Relationship*", "FATHER", "MOTHER", "SPOUSE", "CHILD", "GRAND_PARENT", "GRAND_SPOUSE"
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
    const getUserData: any = localStorage.getItem('NINDetails');
    this.userDetails = JSON.parse(getUserData);

    const getMessage:any = localStorage.getItem('incomplete');
    if(getMessage !== null){
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        localStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }
  }

  toggleChecked(event: any) {
    if (event) {
      this.sameResidence = true;
      this.nextOfKinForm.patchValue({ "address": this.userDetails?.residence });
    } else {
      this.sameResidence = false;
      this.nextOfKinForm.patchValue({ "address": "" });
    }
  }

  getNextOfKinForm() {
    this.nextOfKinForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      nin: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', null),
      ssid: new FormControl('', null),
      relationship: new FormControl('', [Validators.required]),
      specifyRelationship: new FormControl('', this.showOthers ? [Validators.required] : null),
      address: new FormControl('', [Validators.required])
    });

    this.nextOfKinForm.valueChanges.subscribe(() => {
      this.updateDisabledBtn();
    });

    this.nextOfKinForm.get('relationship')?.valueChanges.subscribe({
      next: (value: any) => {
        this.showOthers = value === 'OTHERS';
        this.nextOfKinForm.get('specifyRelationship')?.setValidators(
          value === 'OTHERS' ? [Validators.required] : null
        );
        this.nextOfKinForm.get('specifyRelationship')?.updateValueAndValidity();
      }
    });
  }

  updateDisabledBtn() {
    this.disableBtn = !this.nextOfKinForm.valid;

  }

  getDropdownItems() {
    this.beneficiaryService.getRelationshipDropdown().subscribe({
      next: (item: any) => {
        this.option5 = new Set([
          "Relationship*", "FATHER", "MOTHER", "SPOUSE", "CHILD", "GRAND_PARENT", "GRAND_SPOUSE"
        ].concat(item.data));
      }
    });
  }

  ngOnInit(): void {
    this.getNextOfKinForm();
    this.getDropdownItems();
  }

  submit() {
    if (this.disableBtn) return;

    this.showSpinner = true;
    const getBeneficiaryPhoneNumber:any = localStorage.getItem('beneficiaryPhoneNumber' || null);
    const payload:any = {
      beneficiaryPhoneNumber: getBeneficiaryPhoneNumber,
      firstname: this.nextOfKinForm.value?.firstname,
      lastname: this.nextOfKinForm.value?.lastname,
      relationship: this.nextOfKinForm.value.relationship,
      nokNin: String(this.nextOfKinForm.value?.nin),
      nokSsid: String(this.nextOfKinForm.value?.ssid),
      phoneNumber: this.nextOfKinForm.value?.phoneNumber,
      email: this.nextOfKinForm.value?.email,
      address: this.sameResidence === true ? this.userDetails?.residence : this.nextOfKinForm.value?.address,
      specifyRelationship: this.nextOfKinForm.value?.specifyRelationship ?? "",
    };

    this.beneficiaryService.nextOfKinDetails(payload).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Next of Kin data onboarded successfully!');
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
        });
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
    });
  }
}
