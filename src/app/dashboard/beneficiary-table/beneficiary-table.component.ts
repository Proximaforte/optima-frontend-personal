import { Component } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-beneficiary-table',
  templateUrl: './beneficiary-table.component.html',
  styleUrls: ['./beneficiary-table.component.scss']
})
export class BeneficiaryTableComponent {

  noData: string = "/assets/images/emptydata.svg"
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}


  addBeneficiary(){
    this.router.navigate(["/home/beneficiary"],{relativeTo: this.route});
  }


}
