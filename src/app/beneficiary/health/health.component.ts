import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent {

  constructor(
    private router: Router, private route: ActivatedRoute,
  ){}
  
  options: string[] = [
    "Current health condition",  "Perfect Health",  "Minor Health Concerns", "Major Health Concerns"
  ]

  ailments: string[] = ["Are you currently suffering from any of the following?",
    "High Blood Pressure", "Low Blood Pressure", "Diabetes", "Asthma", "Eye Issues", "Ear issues","Others", "None of the above"
  ]

  hmo: string[] = ["Do you have an HMO","yes", "no"]

  optionz: string[] = ["Are you currently receiving treatment?","yes", "no"]

  fundingOptions: string[] = [
    "Parents", "Self-Funded", "Scholarships", "Free Government Support/Subsidized Education"
  ]

  routeToNext(){
    this.router.navigate(['/home/disability-status'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'disability_status'
      }
    })
  }

}
