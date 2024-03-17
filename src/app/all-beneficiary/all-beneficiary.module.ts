import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBeneficiaryRoutingModule } from './all-beneficiary-routing.module';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';

@NgModule({
  declarations: [
    AllBeneficiaryComponent,
    BeneficiaryDetailspageComponent
  ],
  imports: [
    CommonModule,
    AllBeneficiaryRoutingModule,
    UtilitiesModule
  ],
   providers: [
  ],
})
export class AllBeneficiaryModule { }
