import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';
import { BiometricValidationRequestComponent } from './biometric-validation-request/biometric-validation-request.component';
import { CaptureBiometricComponent } from './capture-biometric/capture-biometric.component';
import { PendingSubmissionComponent } from './pending-submission/pending-submission.component';
import { PendingSubmissionDetailsComponent } from './pending-submission-details/pending-submission-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all-beneficiary',
    pathMatch: 'full',
  },
  { path: 'all-beneficiary', component: AllBeneficiaryComponent },
  { path: 'pending-submission', component: PendingSubmissionComponent },
  { path: 'pending-submission/:reference', component: PendingSubmissionDetailsComponent },
  { path: 'beneficiary-details', component: BeneficiaryDetailspageComponent },
  { path: 'biometric-validation-request', component: BiometricValidationRequestComponent },
{ path: 'capture-biometrics', component: CaptureBiometricComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBeneficiaryRoutingModule { }
