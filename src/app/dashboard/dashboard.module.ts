import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UtilitiesModule } from '../utilities/utilities.module';
import { BeneficiaryTableComponent } from './beneficiary-table/beneficiary-table.component';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const materialModules = [MatIconModule, MatSelectModule, MatSnackBarModule,MatSnackBarModule]

@NgModule({
  declarations: [
    DashboardComponent,
    BeneficiaryTableComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    UtilitiesModule,
    RouterModule,
    materialModules
  ],
  providers:[
  ]
})
export class DashboardModule { }
