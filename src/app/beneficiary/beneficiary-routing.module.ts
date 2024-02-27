import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiaryComponent } from './beneficiary.component';
import { VerificationCodeComponent } from './verify-nin/verification-code/verification-code.component';
import { SetupBiometricsComponent } from './verify-nin/setup-biometrics/setup-biometrics.component';
import { FaceCapturingComponent } from './verify-nin/face-capturing/face-capturing.component';
import { FingerCapturingComponent } from './verify-nin/finger-capturing/finger-capturing.component';
import { FingerCapturingProcedureComponent } from './verify-nin/finger-capturing-procedure/finger-capturing-procedure.component';
import { DisabilityStatusComponent } from './disability-status/disability-status.component';
import { FinancialComponent } from './financial/financial.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'beneficiary',
    pathMatch: 'full',
  },
  { path: 'beneficiary', component: BeneficiaryComponent },
  {path: 'verification-code', component: VerificationCodeComponent},
  {path: 'setup-biometrics', component: SetupBiometricsComponent},
  {path: 'face-capturing', component: FaceCapturingComponent},
  {path: 'finger-capturing', component: FingerCapturingComponent},
  {path: 'finger-capturing-procedure', component: FingerCapturingProcedureComponent},
  {path: 'disability-status', component: DisabilityStatusComponent},
  //  {path: 'financial-status', component: FinancialComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
