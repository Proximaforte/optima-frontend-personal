import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiaryComponent } from './beneficiary.component';
import { VerificationCodeComponent } from './verify-nin/verification-code/verification-code.component';
import { SetupBiometricsComponent } from './verify-nin/setup-biometrics/setup-biometrics.component';
import { FaceCapturingComponent } from './verify-nin/face-capturing/face-capturing.component';
import { FingerCapturingComponent } from './verify-nin/finger-capturing/finger-capturing.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRoutingModule { }
