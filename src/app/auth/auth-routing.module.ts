import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ChangePasswordsComponent } from './change-passwords/change-passwords.component';
import { ForgotPasswordsComponent } from './forgot-passwords/forgot-passwords.component';
import { InputOTPComponent } from './input-otp/input-otp.component';
import { NewPasswordsComponent } from './new-passwords/new-passwords.component';
import { OtpIdentifierComponent } from './otp-identifier/otp-identifier.component';

const routes: Routes = [
   {path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  {path: 'change-passwords', component: ChangePasswordsComponent},
  {path: 'forgot-passwords', component: ForgotPasswordsComponent},
  {path: 'input-otp', component: InputOTPComponent},
  {path: 'input-new-password', component: NewPasswordsComponent},
  {path: 'otp-identifier', component: OtpIdentifierComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
