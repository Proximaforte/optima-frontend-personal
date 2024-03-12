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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaginationComponent } from './pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterBoxComponent } from './filter-box/filter-box.component';
import { SkipCapturingComponent } from './modals/skip-capturing/skip-capturing.component';
import { SuccesfulBiometricsComponent } from './modals/succesful-biometrics/succesful-biometrics.component';
import { SuccessfulBeneficiaryOnboardingComponent } from './modals/successful-beneficiary-onboarding/successful-beneficiary-onboarding.component';
import { WebcamModule } from 'ngx-webcam';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { VerifyBvnOtpComponent } from './verify-bvn-otp/verify-bvn-otp.component';
import { ToastsComponent } from './toasts/toasts.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from '../services/authentication/interceptor/jwt-interceptor.service';


const materialModules = [
  MatDialogModule,MatButtonModule,MatTooltipModule
]
@NgModule({
  declarations: [
    UtilitiesComponent,
    NavigationComponent,
    HeaderComponent,
    SuccesfulPasswordsComponent,
    ChangePasswordComponent,
    PaginationComponent,
    FilterBoxComponent,
    SkipCapturingComponent,
    SuccesfulBiometricsComponent,
    SuccessfulBeneficiaryOnboardingComponent,
    OtpInputComponent,
    VerifyBvnOtpComponent,
    ToastsComponent,
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
    MatCheckboxModule,
    NgxPaginationModule,
    WebcamModule
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
    MatCheckboxModule,
    NgxPaginationModule,
    PaginationComponent,
    FilterBoxComponent,
    OtpInputComponent,
    VerifyBvnOtpComponent,
    ToastsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
  ]
})
export class UtilitiesModule {}
