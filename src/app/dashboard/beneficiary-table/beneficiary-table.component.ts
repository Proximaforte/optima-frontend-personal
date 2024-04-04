import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Beneficiary, PaginationParams, mocks } from 'src/app/models/beneficiary/beneficiary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { TotalOnboarding } from 'src/app/models/beneficiary/beneficiary';

@Component({
  selector: 'app-beneficiary-table',
  templateUrl: './beneficiary-table.component.html',
  styleUrls: ['./beneficiary-table.component.scss']
})
export class BeneficiaryTableComponent implements OnInit {

  beneficiary: Beneficiary[] = [];
  @Output() emitTotals$: EventEmitter<any> = new EventEmitter();
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
  paginationParams: PaginationParams = {
    size: 10,
    page: 1
  }

  totals: TotalOnboarding = {
    completed: 0,
    incompleted: 0
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ){}


  addBeneficiary(){
    this.beneficiaryService.setRouteToDisplay("verify beneficiary nin");
    this.router.navigate(['/home/beneficiary'],{
      relativeTo: this.route,
      queryParams: {
        progress: 'verify_NIN'
      }
    })
   // this.router.navigate(["/home/beneficiary"],{relativeTo: this.route});
  }

  getAllBeneficiries(){
    this.beneficiaryService.getFilteredBeneficiaries(this.beneficiaryService.getFilterParams(), this.paginationParams).subscribe({
      next: (res: any) => {
      //  console.log('complete>>>', res?.data?.beneficiaries);
        this.beneficiary = res?.data?.beneficiaries;
        this.totals.completed = res?.data?.beneficiaries?.length;
        this.emitTotals$.emit(this.totals);
        // if(this.beneficiary?.length === 0){
        //   this.beneficiary = mocks;
        // }
      },
      error: (err: any) => {
        console.error("err>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if(err?.status === 401) this.authService.agentLogout();
      }
    })
  }

  getAllIncompletedBeneficiaries(){
    this.beneficiaryService.getAllIncompleteBeneficiaries(this.beneficiaryService.getFilterParams(),this.paginationParams).subscribe({
      next: (res: any) => {
      //  console.log('complete>>>', res?.data?.beneficiaries);
        //this.beneficiary = res?.data?.beneficiaries;
        this.totals.incompleted = res?.data?.beneficiaries?.length;
        this.emitTotals$.emit(this.totals);
        // if(this.beneficiary?.length === 0){
        //   this.beneficiary = mocks;
        // }
      },
      error: (err: any) => {
        console.error("err>>", err);
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if(err?.status === 401) this.authService.agentLogout();
      }
    })
  }

  // emitTotalArrays(tables:TotalOnboarding){
  //   this.emitTotals$.emit(tables);
  // }

  ngOnInit(): void {
    this.getAllBeneficiries();
    this.getAllIncompletedBeneficiaries();
  }


}
