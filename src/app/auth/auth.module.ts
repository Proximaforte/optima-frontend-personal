import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangePasswordsComponent } from './change-passwords/change-passwords.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ForgotPasswordsComponent } from './forgot-passwords/forgot-passwords.component';
import {MatCardModule} from '@angular/material/card';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { InputOTPComponent } from './input-otp/input-otp.component';
import { NewPasswordsComponent } from './new-passwords/new-passwords.component';
import { authGuard } from '../securities/auth/auth.guard';


const materialModule = [
  MatFormFieldModule, MatIconModule, MatInputModule, MatDialogModule,MatCardModule
]

@NgModule({
  declarations: [
    AuthComponent,
    ChangePasswordsComponent,
    ForgotPasswordsComponent,
    InputOTPComponent,
    NewPasswordsComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    materialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxOtpInputModule
  ],
  providers:[authGuard]
})
export class AuthModule { }
