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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
