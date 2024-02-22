import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBeneficiaryComponent } from './all-beneficiary.component';
import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage/beneficiary-detailspage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all-beneficiary',
    pathMatch: 'full',
  },
  { path: 'all-beneficiary', component: AllBeneficiaryComponent },
  { path: 'beneficiary-details', component: BeneficiaryDetailspageComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBeneficiaryRoutingModule { }
