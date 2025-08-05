
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BeneficiaryService } from '../../services/beneficiary/beneficiary.service';
import {
  Beneficiary,
  IncompleteBeneficiary,
  mocks,
  PaginationParams,
  BeneficiaryProfile,
} from '../../models/beneficiary/beneficiary';
import { AuthService } from '../../services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from '../../services/alert/toasts.service';
import { ToastsComponent } from '../../utilities/toasts/toasts.component';
import { identity, Subscription } from 'rxjs';
import { Location } from '@angular/common'; // Import Location

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-capture-biometric',
  templateUrl: './capture-biometric.component.html',
  styleUrls: ['./capture-biometric.component.scss']
})
export class CaptureBiometricComponent {


    constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private location: Location, // Inject Location
    private fb: FormBuilder,
  ) {
    
  }


    authForm!: FormGroup;
  beneficiaryData: any = null;
  showContinue: boolean = false;
  timestamp = Date.now();

  onSubmit() {
    if (this.authForm.valid) {
      console.log('Form Submitted:', this.authForm.value);
    }
  }

  goToDetails() {
  this.beneficiaryService.setBeneficiary(this.beneficiaryData);

      localStorage.removeItem('NINDetails');
    localStorage.removeItem('beneficiaryPhoneNumber');
    localStorage.removeItem('biometrics');
    sessionStorage.removeItem('biometrics');
    localStorage.removeItem('incomplete');
    localStorage.removeItem('verification');
    localStorage.removeItem('nin');
    localStorage.removeItem('faceCapture_skipThumPrints');
    localStorage.removeItem('isFingerprintOk');
    localStorage.removeItem('userAddress');
    

    localStorage.setItem('beneficiaryPhoneNumber', this.beneficiaryData?.phoneNumber);
 


  // this.router.navigate(['/home/beneficiary-details']);

     this.beneficiaryService.verifyNIN(this.beneficiaryData?.nin).subscribe({
      next: (details: any) => {
        const stringedData = JSON.stringify(details?.data);
        localStorage.setItem('NINDetails', stringedData);
        // localStorage.setItem('NINDetails', stringedData);
      },
    });


    this.beneficiaryService.setRouteToDisplay('biometrics');
      sessionStorage.setItem('biometrics', 'biometrics');
      this.router.navigate(['/home/setup-biometrics'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'setup_biometrics',
        },
      });
}


getFormValues() {
    this.authForm = new FormGroup({
      nin: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
    });

    this.authForm.get('nin')?.valueChanges.subscribe({
      next: (value: string) => {
        if (value.length === 11) {
          // this.showLoader = true;
          this.beneficiaryService.verifyNinOrPhone(value).subscribe({
            next: (response: any) => {
              //  const response =  JSON.parse(this.beneficiaryService.decryptData(response));
              // this.showLoader = false;
              if (response?.responseCode === 200) {
                this.toast.setSuccessMessage("Beneficiary is Found!")

                localStorage.setItem(
                  'beneficiaryPhoneNumber',
                  response?.data?.phone,
                );
                localStorage.setItem(
                  'NINDetails',
                  JSON.stringify(response?.data),
                );

                this.beneficiaryData = response.data;
                this.showContinue = true;

                //   if (response?.data?.formStage) {
                // this.continueOnboarding(response?.data)

                //             this.dialog.closeAll();
                //   } else {
                //     this.showBtn = true;
                //   }
                //  this.showBtn = true;
                this.snackbar.openFromComponent(ToastsComponent, {
                  duration: 4000,
                  verticalPosition: 'bottom',
                });
              }
            },
            error: (err: any) => {
              //  console.error('err>>>', err);
              // this.showBtn = false;
              this.showContinue = false;

              this.toast.setErrorMessage(
                err?.error?.failureReason ||
                  err?.error?.responseMessage ||
                  err?.statusText,
              );
              this.snackbar.openFromComponent(ToastsComponent, {
                duration: 4000,
                verticalPosition: 'bottom',
              });
              // setTimeout(() => location.reload(), 3000);
            },
          });
        }

        else if(value.length !== 11){
            this.showContinue = false;
        }
      },
    });
  }



   ngOnInit(): void {


    this.getFormValues();
  }



  


}
