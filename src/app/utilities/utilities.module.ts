import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { UtilitiesComponent } from './utilities.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SuccesfulPasswordsComponent } from './modals/succesful-passwords/succesful-passwords.component';
import { ChangePasswordComponent } from './modals/change-password/change-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
const materialModules = [
  MatDialogModule
]
@NgModule({
  declarations: [
    UtilitiesComponent,
    NavigationComponent,
    HeaderComponent,
    SuccesfulPasswordsComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    UtilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    UtilitiesRoutingModule,
    materialModules,
    RouterModule,
    MatCardModule,
  ],
  exports: [
    CommonModule,
    UtilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NavigationComponent,
    HeaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
  ],
})
export class UtilitiesModule {}
