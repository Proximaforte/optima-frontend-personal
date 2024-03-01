import { Component } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-beneficiary-table',
  templateUrl: './beneficiary-table.component.html',
  styleUrls: ['./beneficiary-table.component.scss']
})
export class BeneficiaryTableComponent {

  noData: string = "/assets/images/emptydata.svg";
  agents: any = [
    { text: 'Agent code', data: 'AG1023', icon: 'assets/images/agentcode.svg' },
    {
      text: 'center',
      data: 'Illar Plaza',
      icon: 'assets/images/center.svg',
    },
    {
      text: 'center code',
      data: 'KW/IL/02',
      icon: 'assets/images/centercode.svg',
    },
    { text: 'LGA', data: 'ILLorin South', icon: 'assets/images/lga.svg' },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}


  addBeneficiary(){
    this.routeService.setRouteToDisplay("verify beneficiary nin");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'verify_NIN'
      }
    })
   // this.router.navigate(["/home/beneficiary"],{relativeTo: this.route});
  }


}
