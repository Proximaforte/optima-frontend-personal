import { Component } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {

  options: string[] = [
    "SSCE", "OND", "HND", "B.SC", "B.Tech", "B.Eng", "M.Sc", "Ph.D", "Doctorate","Others", "None of the above"
  ]

  fundingOptions: string[] = [
    "Parents", "Self-Funded", "Scholarships", "Free Government Support/Subsidized Education"
  ]
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}

  submit(){
    this.routeService.setRouteToDisplay("health");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'health'
      }
    })
  }
}
