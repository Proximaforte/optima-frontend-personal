import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBeneficiaryRoutingModule } from './all-beneficiary-routing.module';
import { AllBeneficiaryComponent } from './all-beneficiary.component';


@NgModule({
  declarations: [
    AllBeneficiaryComponent
  ],
  imports: [
    CommonModule,
    AllBeneficiaryRoutingModule
  ]
})
export class AllBeneficiaryModule { }
