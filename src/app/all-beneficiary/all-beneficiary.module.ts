import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBeneficiaryRoutingModule } from './all-beneficiary-routing.module';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';
import { BeneficiaryFilterPipe } from './pipes/beneficiary-filter.pipe';

@NgModule({
  declarations: [
    AllBeneficiaryComponent,
    BeneficiaryDetailspageComponent,
    BeneficiaryFilterPipe
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
