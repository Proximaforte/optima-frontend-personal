import { Component } from '@angular/core';

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
  constructor(){}
}
