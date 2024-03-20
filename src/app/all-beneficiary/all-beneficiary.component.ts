import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterBoxComponent } from '../utilities/filter-box/filter-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { Beneficiary } from '../models/beneficiary/beneficiary';
import { AuthService } from '../services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from '../services/alert/toasts.service';
import { ToastsComponent } from '../utilities/toasts/toasts.component';

@Component({
  selector: 'app-all-beneficiary',
  templateUrl: './all-beneficiary.component.html',
  styleUrls: ['./all-beneficiary.component.scss'],
})
export class AllBeneficiaryComponent implements OnInit{
  // public page = 0;
  // public pageSize = 15;
  // public paginator: any;
  // public start!: number;
  // public end!: number;
  // public total: number = 0;
  // public element!: number;
  lastpage!: number;
  currentPage: number = 1;
  beneficiaries: Beneficiary[] = [];
  showSpinner: boolean = false;
  showNoData: boolean = false
  emptyTable: string = "/assets/images/noDataFound.png";

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
    ) {}

  openModal(): void {
    const dialogRef = this.dialog.open(FilterBoxComponent, {
      width: '30%',
      height: '100%',
      panelClass: 'custom-dialog-container',

      position: { right: '0' },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  // public pageChanged(pageInfo: number) {
  //   this.page = pageInfo - 1;
  //   this.paginator.currentPage = pageInfo;
  //   // this.loadData();
  // }

  routeToOnboarding(){
    this.router.navigateByUrl('/home/beneficiary');
  }

  getAllBeneficiaries(){
    this.showSpinner = true;
    this.beneficiaryService.getAllBeneficiaries().subscribe({
      next: (res: any) => {
        this.showSpinner = false;
       console.log('res>>', res?.data);
        this.beneficiaries = res?.data?.beneficiaries;
        if(res?.data?.beneficiaries?.length === 0){
          this.showNoData = true;
          this.showSpinner = false;
        }else{
          this.showNoData = false;
        }
      },
      error: (err:any) => {
        console.error('err>>>', err);
        this.showSpinner = false;
        this.showNoData = true;
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if(err?.status === 401){
          this.showSpinner = false;
         this.authService.agentLogout();
          }
      }
    })
  }

  ngOnInit(): void {
    this.getAllBeneficiaries();
  }

  viewBeneficiaryProfile(beneficiary:any):any{
   // console.log('beneficiary>>>', beneficiary);
    this.beneficiaryService.setBeneficiaryProfile(beneficiary);
  }
}
