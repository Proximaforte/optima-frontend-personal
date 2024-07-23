import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { ToastsComponent } from '../../toasts/toasts.component';

@Component({
  selector: 'app-successful-beneficiary-onboarding',
  templateUrl: './successful-beneficiary-onboarding.component.html',
  styleUrls: ['./successful-beneficiary-onboarding.component.scss']
})
export class SuccessfulBeneficiaryOnboardingComponent {
  successMark: string = "/assets/images/congratulationz.jpg";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ){}

  routeBeneficiaryTable(){
    const beneficiaryPhoneNumber:any = localStorage.getItem('beneficiaryPhoneNumber');
    this.router.navigate(['/home/all-beneficiary'],{relativeTo: this.route});
    localStorage.removeItem("NINDetails")
    localStorage.removeItem("beneficiaryPhoneNumber")
    localStorage.removeItem("biometrics")
    localStorage.removeItem("incomplete")
    localStorage.removeItem("verification")
    localStorage.removeItem("nin")
    localStorage.removeItem("faceCapture_skipThumPrints")
    localStorage.removeItem("isFingerprintOk")
    // this.beneficiaryService.onboardingSubmitted(beneficiaryPhoneNumber).subscribe({
    //   next: (res:any) => {
    //   },
    //   error: (err: any) => {
    //     console.error('err>>>', err);
    //     this.toast.setSuccessMessage(err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
    //     this.toast.setErrorMessage(err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
    //     this.snackbar.openFromComponent(ToastsComponent, {
    //       duration: 4000,
    //       verticalPosition: 'bottom',
    //     });
    //     if(err?.status === 401){
    //     this.auth.agentLogout();
    //     }
    //   }
    // })
  }
}
