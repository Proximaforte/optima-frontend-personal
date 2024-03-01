import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.component.html',
  styleUrls: ['./next-of-kin.component.scss']
})
export class NextOfKinComponent {

  options:string[]=["State of residence"];
  option2:string[]=["Local government of residence"];
  financialInfoForm!: FormGroup ;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}

  submit(){
    this.routeService.setRouteToDisplay("employment");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'employment'
      }
    })
  }

}
