import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NigerianStates,
  localGovt,
} from 'src/app/models/beneficiary/beneficiary';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-residential-details',
  templateUrl: './residential-details.component.html',
  styleUrls: ['./residential-details.component.scss'],
})
export class ResidentialDetailsComponent implements OnInit {
  options: string[] = [
    'Does beneficiary own where he lives?*',
    'Yes, a house owner',
    'No, a tenant',
  ];

  conditionoptions: string[] = [''];

  states: string[] = NigerianStates;
  lga: any[] = localGovt;
  selectedState: string = NigerianStates[24]; // Default to the 24th state
  residentialInfo!: FormGroup;
  selectedLGA: string[] = [];
  selectedWard: string[] = ['Select Ward'];
  showOthers: boolean = false;
  userDetails: any = {};
  disableBtn: boolean = true;
  showSpinner: boolean = false;
  showWelcomeMsg: boolean = false;

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

    const getMessage: any = sessionStorage.getItem('incomplete');
    if (getMessage !== null) {
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        sessionStorage.removeItem('incomplete');
      }, 2500);
    } else {
      this.showWelcomeMsg = false;
    }
  }

  selectState(value: any) {
    this.selectedState = value;
    this.updateLGA();
  }

  updateLGA() {
    const selectedStateLGA = this.lga.find(
      (item) => item.state === this.selectedState,
    );
    this.selectedLGA = selectedStateLGA ? selectedStateLGA.localGovt : [];
  }

  residencyForm() {
    this.residentialInfo = new FormGroup({
      placeOfResidence: new FormControl('', [Validators.required]),
      noOfRooms: new FormControl('', [Validators.required]),
      // ownershipStatus: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      annualPay: new FormControl('', this.showOthers ? [Validators.required] : null),
      selectState: new FormControl(this.selectedState, [Validators.required]),
      selectLga: new FormControl('', [Validators.required]),
      selectWard: new FormControl('', [Validators.required]),
      community: new FormControl('', [Validators.required]),
      houseCondition: new FormControl('', [Validators.required]),
    });

    this.residentialInfo.valueChanges.subscribe(() => this.updateDisabledBtn());

    this.residentialInfo.get('selectState')?.valueChanges.subscribe({
      next: (item: any) => {
        this.selectState(item);
      },
    });

    this.residentialInfo.get('placeOfResidence')?.valueChanges.subscribe({
      next: (value: any) => {
        this.showOthers = value === 'No, a tenant';
      },
    });

    // Initialize the LGAs for the default state
    this.updateDisabledBtn();
    this.updateLGA();
    this.getQualityRating();
    this.residentialInfo.get('selectLga')?.valueChanges.subscribe({
      next: (value: any) => {
        if (value) {
          this.getWards(value);
        }
      },
    });
  }

  updateDisabledBtn() {
    this.disableBtn = !this.residentialInfo.valid;
  }

  ngOnInit(): void {
    this.residencyForm();
    this.updateDisabledBtn();
  }

  getQualityRating() {
    this.beneficiaryService.getAllQualityRatings().subscribe({
      next: (data: any) => {
        this.conditionoptions = Array.isArray(data?.data)
          ? ['What are the conditions of your housing?*', ...data?.data]
          : [];
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

  getWards(lga: string) {
    this.beneficiaryService.getAllWardList(lga).subscribe({
      next: (data: any) => {
        this.selectedWard = Array.isArray(data?.data)
          ? ['Select Ward', ...data?.data]
          : [];
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

  submitForm() {
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber: any = localStorage.getItem(
      'beneficiaryPhoneNumber',
    );
    const payload: any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      community: this.residentialInfo.value.community,
      ward: this.residentialInfo.value.selectWard,
      numberOfRoomInHouse: this.residentialInfo.value.noOfRooms,
      houseCondition: this.residentialInfo.value.houseCondition,
      houseOwner:
        this.residentialInfo.value.placeOfResidence === 'Yes, a house owner',
      annualRent: Number(this.residentialInfo.value?.annualPay),
      address: this.residentialInfo.value?.address,
      state: this.residentialInfo.value?.selectState,
      lga: this.residentialInfo.value?.selectLga,
    };

    this.beneficiaryService.residentialDetails(payload).subscribe({
      next: (res: any) => {


        const decryptedResponse = JSON.parse(this.beneficiaryService.decryptData(res));

        localStorage.setItem("userAddress", decryptedResponse.data.address)
        
        this.showSpinner = false;
        this.beneficiaryService.setRouteToDisplay('marital info');
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: { progress: 'marital_info' },
        });
        this.toast.setSuccessMessage(
          'Beneficiary Residential Details is onboarded successfully!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      },
      error: (err: any) => {
        console.error('err>>', err);
        this.showSpinner = false;
        this.toast.setErrorMessage(
          err?.error?.responseMessage ||
            err?.statusText ||
            'Oops an error occurred!',
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
