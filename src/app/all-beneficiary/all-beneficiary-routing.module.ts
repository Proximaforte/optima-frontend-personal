import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBeneficiaryComponent } from './all-beneficiary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all-beneficiary',
    pathMatch: 'full',
  },
  { path: 'all-beneficiary', component: AllBeneficiaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBeneficiaryRoutingModule { }
