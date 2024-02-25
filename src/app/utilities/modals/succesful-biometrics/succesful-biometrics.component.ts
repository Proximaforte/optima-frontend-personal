import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-succesful-biometrics',
  templateUrl: './succesful-biometrics.component.html',
  styleUrls: ['./succesful-biometrics.component.scss']
})
export class SuccesfulBiometricsComponent {

  successMark: string = "/assets/images/mark.svg";
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}


  submit(){
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'personal_details'
      }
    })
  }
}
