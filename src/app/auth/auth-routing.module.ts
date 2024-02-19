import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ChangePasswordsComponent } from './change-passwords/change-passwords.component';
import { ForgotPasswordsComponent } from './forgot-passwords/forgot-passwords.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {path: 'change-passwords', component: ChangePasswordsComponent},
  {path: 'forgot-paswords', component: ForgotPasswordsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
