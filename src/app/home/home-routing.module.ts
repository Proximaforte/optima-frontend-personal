import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

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
        path: 'beneficiary',
        data: { title: 'Add Beneficiary' },
        loadChildren: () =>
          import('../beneficiary/beneficiary.module').then(
            (m) => m.BeneficiaryModule
          ),
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },

      {
        path: 'onboarding',
        data: { title: 'Onboarding Beneficiary' },
        loadChildren: () =>
          import('../onboarding/onboarding.module').then(
            (m) => m.OnboardingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
