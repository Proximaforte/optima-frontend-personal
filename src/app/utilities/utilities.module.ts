import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilitiesRoutingModule } from './utilities-routing.module';
import { UtilitiesComponent } from './utilities.component';
import { SuccesfulPasswordsComponent } from './modals/succesful-passwords/succesful-passwords.component';
import { ChangePasswordComponent } from './modals/change-password/change-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

const materialModules = [
  MatDialogModule
]

@NgModule({
  declarations: [
    UtilitiesComponent,
    SuccesfulPasswordsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UtilitiesRoutingModule,
    materialModules,
    RouterModule
  ]
})
export class UtilitiesModule { }
