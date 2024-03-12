import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllBeneficiaryRoutingModule } from './all-beneficiary-routing.module';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from '../services/authentication/interceptor/jwt-interceptor.service';

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
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }  
  ],
})
export class AllBeneficiaryModule { }
