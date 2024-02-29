import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-successful-beneficiary-onboarding',
  templateUrl: './successful-beneficiary-onboarding.component.html',
  styleUrls: ['./successful-beneficiary-onboarding.component.scss']
})
export class SuccessfulBeneficiaryOnboardingComponent {

  successMark: string = "/assets/images/congratulationz.jpg";
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  routeBeneficiaryTable(){
    this.router.navigate(['/home/all-beneficiary'],{relativeTo: this.route});
  }
}
