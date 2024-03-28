import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBeneficiaryRoutingModule } from './all-beneficiary-routing.module';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';
import { BeneficiaryFilterPipe } from './pipes/beneficiary-filter.pipe';
import {MatIconModule} from '@angular/material/icon';
import { IncompletePipe } from './pipes/incomplete.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

const materialModules = [MatIconModule, MatMenuModule, MatButtonModule]

@NgModule({
  declarations: [
    AllBeneficiaryComponent,
    BeneficiaryDetailspageComponent,
    BeneficiaryFilterPipe,
    IncompletePipe
  ],
  imports: [
    CommonModule,
    AllBeneficiaryRoutingModule,
    UtilitiesModule,
    materialModules
  ],
   providers: [
  ],
})
export class AllBeneficiaryModule { }
