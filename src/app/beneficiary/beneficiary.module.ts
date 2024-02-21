import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { BeneficiaryComponent } from './beneficiary.component';
import {MatStepperModule} from '@angular/material/stepper';


const materialModules = [
  MatStepperModule
]


@NgModule({
  declarations: [
    BeneficiaryComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    materialModules
  ]
})
export class BeneficiaryModule { }
