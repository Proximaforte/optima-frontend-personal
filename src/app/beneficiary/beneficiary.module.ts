import { NgModule } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';


const materialModules = [
  MatStepperModule, MatExpansionModule
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
    OtherDetailsComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    materialModules,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BeneficiaryModule { }
