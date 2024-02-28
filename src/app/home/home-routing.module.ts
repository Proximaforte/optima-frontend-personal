import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PersonalDetailsComponent } from './beneficiaries/personal-details/personal-details.component';
import { ResidentDetailsComponent } from './beneficiaries/resident-details/resident-details.component';
import { MaritalInfoComponent } from './beneficiaries/marital-info/marital-info.component';
import { EducationComponent } from './beneficiaries/education/education.component';
import { HealthComponent } from './beneficiaries/health/health.component';
import { FinancialComponent } from './beneficiaries/financial/financial.component';
import { NextOfKinComponent } from './beneficiaries/next-of-kin/next-of-kin.component';
import { EmploymentComponent } from './beneficiaries/employment/employment.component';
import { OtherDetailsComponent } from './beneficiaries/other-details/other-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: '',
        data: { title: 'Add Beneficiaries' },
        loadChildren: () =>
          import('../beneficiary/beneficiary.module').then(
            (m) => m.BeneficiaryModule
          ),
      },

      {
        path: '',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },

      {
        path: '',
        data: { title: 'All Beneficiaries' },
        loadChildren: () =>
          import('../all-beneficiary/all-beneficiary.module').then(
            (m) => m.AllBeneficiaryModule
          ),
      },
    ],
  },
  { path: 'beneficiary/personal-details', component: PersonalDetailsComponent }, //  /home/beneficiary/personal-details
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
