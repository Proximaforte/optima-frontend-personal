import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-succesful-biometrics',
  templateUrl: './succesful-biometrics.component.html',
  styleUrls: ['./succesful-biometrics.component.scss']
})
export class SuccesfulBiometricsComponent {
//setRouteToDisplay
  successMark: string = "/assets/images/mark.svg";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}


  submit(){

    const biometrics = sessionStorage.getItem("biometrics");

    if(biometrics === 'biometrics'){
      sessionStorage.removeItem('biometrics');
      this.router.navigate(['/home/dashboard']);
    }

    else{

          this.routeService.setRouteToDisplay("residential details");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'residential_details'
      }
    })
    console.log('yes');

    }


    
  
  }
}
