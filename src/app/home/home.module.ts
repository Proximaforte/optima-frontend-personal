import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { PersonalDetailsComponent } from './beneficiaries/personal-details/personal-details.component';
import { ResidentDetailsComponent } from './beneficiaries/resident-details/resident-details.component';
import { MaritalInfoComponent } from './beneficiaries/marital-info/marital-info.component';
import { EducationComponent } from './beneficiaries/education/education.component';
import { HealthComponent } from './beneficiaries/health/health.component';
import { FinancialComponent } from './beneficiaries/financial/financial.component';
import { NextOfKinComponent } from './beneficiaries/next-of-kin/next-of-kin.component';
import { EmploymentComponent } from './beneficiaries/employment/employment.component';
import { OtherDetailsComponent } from './beneficiaries/other-details/other-details.component';
import { SidebarHelperComponent } from '../beneficiary/verify-nin/sidebar-helper/sidebar-helper.component';
import { SideBarHelperComponent } from './beneficiaries/side-bar-helper/side-bar-helper.component';

@NgModule({
  declarations: [
    HomeComponent,
    PersonalDetailsComponent,
    ResidentDetailsComponent,
    MaritalInfoComponent,
    EducationComponent,
    HealthComponent,
    FinancialComponent,
    NextOfKinComponent,
    EmploymentComponent,
    OtherDetailsComponent,
    SideBarHelperComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UtilitiesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
