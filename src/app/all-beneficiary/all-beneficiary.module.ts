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
import {ConsentModalComponent} from '../consent-modal/consent-modal.component';
import { WebcamModule } from 'ngx-webcam';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
const materialModules = [MatIconModule, MatMenuModule, MatButtonModule]

@NgModule({
  declarations: [
    AllBeneficiaryComponent,
    BeneficiaryDetailspageComponent,
    BeneficiaryFilterPipe,
    IncompletePipe,
    ConsentModalComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    AllBeneficiaryRoutingModule,
    UtilitiesModule,
    materialModules,
    WebcamModule,
  ],

  exports: [
    ConsentModalComponent, // Export the component
  ],
})
export class AllBeneficiaryModule {}
