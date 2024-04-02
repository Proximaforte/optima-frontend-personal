import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { BeneficiaryComponent } from './beneficiary.component';
import {MatStepperModule} from '@angular/material/stepper';
import { VerifyNINComponent } from './verify-nin/verify-nin.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ResidentialDetailsComponent } from './residential-details/residential-details.component';
import { MaritalInfoComponent } from './marital-info/marital-info.component';
import { EducationComponent } from './education/education.component';
import { HealthComponent } from './health/health.component';
import { FinancialComponent } from './financial/financial.component';
import { NextOfKinComponent } from './next-of-kin/next-of-kin.component';
import { EmploymentComponent } from './employment/employment.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { VerificationCodeComponent } from './verify-nin/verification-code/verification-code.component';
import { SetupBiometricsComponent } from './verify-nin/setup-biometrics/setup-biometrics.component';
import { FaceCapturingComponent } from './verify-nin/face-capturing/face-capturing.component';
import { CaptureCompleteComponent } from './verify-nin/capture-complete/capture-complete.component';
import { FingerCapturingComponent } from './verify-nin/finger-capturing/finger-capturing.component';
import { FingerCapturingProcedureComponent } from './verify-nin/finger-capturing-procedure/finger-capturing-procedure.component';
import { SkipCapturingModalComponent } from './verify-nin/skip-capturing-modal/skip-capturing-modal.component';
import { BiometricsSuccessfulModalComponent } from './verify-nin/biometrics-successful-modal/biometrics-successful-modal.component';
import { SidebarHelperComponent } from './verify-nin/sidebar-helper/sidebar-helper.component';
import { MatCardModule } from '@angular/material/card';
import { WebcamModule } from 'ngx-webcam';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { DisabilityStatusComponent } from './disability-status/disability-status.component';
import { FingerCaptureCompleteComponent } from './verify-nin/finger-capture-complete/finger-capture-complete.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OccupationComponent } from './occupation/occupation.component';



const materialModules = [
  MatStepperModule, MatExpansionModule, MatFormFieldModule,
   MatInputModule,MatIconModule, MatCardModule, MatDialogModule,MatSelectModule,
   MatSnackBarModule, MatDatepickerModule
]


@NgModule({
  declarations: [
    BeneficiaryComponent,
    VerifyNINComponent,
    PersonalDetailsComponent,
    ResidentialDetailsComponent,
    MaritalInfoComponent,
    EducationComponent,
    HealthComponent,
    FinancialComponent,
    NextOfKinComponent,
    EmploymentComponent,
    OtherDetailsComponent,
    VerificationCodeComponent,
    SetupBiometricsComponent,
    FaceCapturingComponent,
    CaptureCompleteComponent,
    FingerCapturingComponent,
    FingerCapturingProcedureComponent,
    SkipCapturingModalComponent,
    BiometricsSuccessfulModalComponent,
    SidebarHelperComponent,
    DisabilityStatusComponent,
    FingerCaptureCompleteComponent,
    OccupationComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    materialModules,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    UtilitiesModule,
    MatNativeDateModule
  ],
  providers:[
    MatSnackBarModule, 
  ],
  exports: [SidebarHelperComponent]
})
export class BeneficiaryModule { }
