import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';

import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-biometric-validation-request',
  templateUrl: './biometric-validation-request.component.html',
  styleUrls: ['./biometric-validation-request.component.scss'],
})
export class BiometricValidationRequestComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
  ) {}

  nin: string = "";
  showSpinner: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nin = params['data'];
    });
  }

  onValidationRequest() {
    this.showSpinner = true;

    this.beneficiaryService.submitBiometricRequest(this.nin).subscribe({
      next: (response) => {
        this.showSpinner = false;
        //this.snackBar.openSnackBar(response.data,  'success');
        this.toast.setSuccessMessage(response.data);
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'top',
        });

        this.router.navigate(['/home/all-beneficiary']);
      },
      error: (error) => {
        this.showSpinner = false;
        const message =
          error?.error?.responseMessage ||
          'Failed to Send Validation Request. Please try again.';
        //this.snackBar.openSnackBar(message,  'error');
        this.toast.setErrorMessage(message);
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      },
    });
  }
}
