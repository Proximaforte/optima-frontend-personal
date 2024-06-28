import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterBoxComponent } from '../utilities/filter-box/filter-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { Beneficiary, IncompleteBeneficiary, mocks, PaginationParams, BeneficiaryProfile } from '../models/beneficiary/beneficiary';
import { AuthService } from '../services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from '../services/alert/toasts.service';
import { ToastsComponent } from '../utilities/toasts/toasts.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-all-beneficiary',
  templateUrl: './all-beneficiary.component.html',
  styleUrls: ['./all-beneficiary.component.scss'],
})
export class AllBeneficiaryComponent implements OnInit {

  lastpage!: number;
  currentPage: number = 1;
  beneficiaries: Beneficiary[] = [];
  inCompleteBeneficiaries: IncompleteBeneficiary[] = [];
  showSpinner: boolean = false;
  showNoData: boolean = false
  emptyTable: string = "/assets/images/noDataFound.png";
  paginationParams: PaginationParams = {
    size: 10,
    page: 1
  }
  paginationArrayToShow: any = []
  paginationNumber: any[] = [];
  filterString: any = "";
  filterIncomplete: any = "";
  showIncompleteBeneficiaries: boolean = false;
  showCompleteBeneficiaries: boolean = true;
  beneficiaryFilterSubscription$!: Subscription;
  routeArray: any = [
    {
      routeToDiaplay: 'verify beneficiary nin',
      queryParam: 'verify_NIN'
    },
    {
      routeToDiaplay: 'personal details',
      queryParam: 'personal_details'
    },
    {
      routeToDiaplay: 'residential details',
      queryParam: 'residential_details'
    },
    {
      routeToDiaplay: 'marital info',
      queryParam: 'marital_info'
    },
    {
      routeToDiaplay: 'education',
      queryParam: 'education'
    },
    {
      routeToDiaplay: 'health',
      queryParam: 'health'
    },
    {
      routeToDiaplay: 'financial',
      queryParam: 'financial'
    },
    {
      routeToDiaplay: 'next of kin',
      queryParam: 'next_of_kin'
    },
    {
      routeToDiaplay: 'employment',
      queryParam: 'employment'
    },
    {
      routeToDiaplay: 'other details',
      queryParam: 'other_details'
    },
  ]
  // | beneficiaryFilter: filterString;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ) {}

  showInCompleteBeneficiaries() {
    this.showNoData = false;
    this.showIncompleteBeneficiaries = true;
    this.showCompleteBeneficiaries = false;
    this.getAllIncompleteBeneficiaries();
  }


  showcompleteBeneficiaries() {
    this.showCompleteBeneficiaries = true;
    this.showIncompleteBeneficiaries = false;
    this.getAllBeneficiaries();
  }

  openModal(): void {
   // console.log("Filter completed beneficiaries");
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

  openSecondModal():void{
    //console.log("Filter incompleted beneficiaries");
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

  routeToOnboarding() {
    this.router.navigateByUrl('/home/beneficiary');
  }

  listenToSearch(event: any){
    // console.log("event>>>", event);
     console.log('filterString>>>', this.filterIncomplete);
    this.showSpinner = true;
    this.getAllIncompleteBeneficiaries();
    this.getAllBeneficiaries();
  }

  getAllIncompleteBeneficiaries() {
    this.showSpinner = true;
    this.beneficiaryFilterSubscription$ = this.beneficiaryService.getBeneficiaryParams().subscribe({
      next: (dataToFilter: any) => {
        this.beneficiaryService.getAllIncompleteBeneficiaries(
          Object.entries({})?.length === 0 ? {filterString: this.filterIncomplete}   : dataToFilter, 
          this.paginationParams
        ).subscribe({
          next: (res: any) => {
            this.showSpinner = false;
            this.inCompleteBeneficiaries = res?.data?.beneficiaries;
            //  console.log('incomplete beneficiaries>>', this.inCompleteBeneficiaries);
            // this.beneficiaries = mocks;
            // this.paginationParams.size = res?.size;
            // this.paginationParams.page = res?.page;
           // this.paginationNumber = Array.from({ length: this.inCompleteBeneficiaries.length }, (_, index) => index + 1);
           this.paginationArrayToShow = Array(this.paginationParams.page).fill(this.paginationParams.page).map((_, index) => index + 1);
            if (this.inCompleteBeneficiaries?.length === 0) {  //res?.data?.beneficiaries?.length
              this.showNoData = true;
              this.showSpinner = false;
            } else {
              this.showNoData = false;
            }
          },
          error: (err: any) => {
            console.error('err>>>', err);
            this.showSpinner = false;
            this.showNoData = true;
            this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText === 'Unknown Error' ? 'Network Error' : err?.statusText || "Oops an error occured!");
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
            if(err?.status === 401  || err?.error?.responseCode === 401){
              this.showSpinner = false;
             this.authService.agentLogout();
              }
          }
        })
      }
    })

  }

  getAllBeneficiaries() {
    this.showSpinner = true;
    this.beneficiaryFilterSubscription$ = this.beneficiaryService.getBeneficiaryParams().subscribe({
      next: (dataToFilter:any) => {
        this.beneficiaryService.getFilteredBeneficiaries(
          Object.entries({})?.length === 0 ? { filterString: this.filterString}  : dataToFilter, 
          this.paginationParams
        ).subscribe({
          next: (res: any) => {
            this.showSpinner = false;
            // console.log('res>>', res?.data);
            this.beneficiaries = res?.data?.beneficiaries;
           // this.paginationNumber = Array.from({ length: this.beneficiaries.length }, (_, index) => index + 1);
             this.paginationArrayToShow = Array(this.paginationParams.page).fill(this.paginationParams.page).map((_, index) => index + 1);
            if (this.beneficiaries?.length === 0) {  
              this.showNoData = true;
              this.showSpinner = false;
            } else {
              this.showNoData = false;
            }
          },
          error: (err: any) => {
            console.error('err>>>', err);
            this.showSpinner = false;
            this.showNoData = true;
            this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText === 'Unknown Error' ? 'Network Error' : err?.statusText || "Oops an error occured!");
            this.snackbar.openFromComponent(ToastsComponent, {
              duration: 4000,
              verticalPosition: 'bottom',
            });
            if(err?.status === 401 || err?.error?.responseCode === 401){
              this.showSpinner = false;
             this.authService.agentLogout();
              }
          }
        })


      }
    })
  
  }

  ngOnInit(): void {
    this.getAllBeneficiaries();
    // this.getAllIncompleteBeneficiaries();
  }

  viewBeneficiaryProfile(beneficiary: BeneficiaryProfile | any): any {
    // console.log('beneficiary>>>', beneficiary);
    this.beneficiaryService.setBeneficiaryProfile(beneficiary);
    this.router.navigate(['/home/beneficiary-details'], {
      relativeTo: this.route,
      queryParams: {
        data: beneficiary?.ssid
      }
    })
  }



  continueOnboarding(beneficiary: BeneficiaryProfile | any) {
    sessionStorage.setItem('beneficiaryPhoneNumber', beneficiary?.phoneNumber);
    sessionStorage.setItem('incomplete', "Let's continue from where you've stopped!");
    this.beneficiaryService.verifyNIN(beneficiary?.nin).subscribe({
      next: (details:any) => {
        const stringedData = JSON.stringify(details?.data);
        sessionStorage.setItem('NINDetails', stringedData);
      }
    })
 
    if (beneficiary?.formStage === "VERIFICATION") {
      this.beneficiaryService.setRouteToDisplay("verify beneficiary nin");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verify_NIN'
        }
      })
    } else if (beneficiary?.formStage === "NIN_VERIFICATION") {
      this.beneficiaryService.setRouteToDisplay("personal details");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'personal_details'
        }
      })
    } else if (beneficiary?.formStage === "OTP_VERIFICATION") {
      this.beneficiaryService.setRouteToDisplay("biometrics");
      sessionStorage.setItem('biometrics', 'biometrics');
      this.router.navigate(['/home/setup-biometrics'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'setup_biometrics'
        }
      })
      // this.router.navigate(['/home/setup-biometrics'], {
      //   relativeTo: this.route,
      //   queryParams: {
      //     progress: 'finger_capture_done'
      //   }
      // })
    } else if (beneficiary?.formStage === "PERSONAL_DETAILS" || beneficiary?.formStage === "VERIFIED") {
      this.beneficiaryService.setRouteToDisplay("verification procedure");
      sessionStorage.setItem('verification', 'verification');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verification_procedure'
        }
      })
    } else if (beneficiary?.formStage === "BIO_VERIFICATION") {
      this.beneficiaryService.setRouteToDisplay("residential details");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'residential_details'
        }
      })
    } else if (beneficiary?.formStage === "ADDRESS_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("marital info");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'marital_info'
        }
      })
    } else if (beneficiary?.formStage === "MARITAL_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("education");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'education'
        }
      })
    } else if (beneficiary?.formStage === "EDUCATION_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("health");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'health'
        }
      })
    } else if (beneficiary?.formStage === "HEALTH_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("financial");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'financial'
        }
      })
    } else if (beneficiary?.formStage === "FINANCIAL_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("next of kin");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'next_of_kin'
        }
      })
    } else if (beneficiary?.formStage === "NEXT_OF_KIN") {
      this.beneficiaryService.setRouteToDisplay("employment");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'employment'
        }
      })
    } else if (beneficiary?.formStage === "EMPLOYMENT_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("occupation");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'occupation'
        }
      })
    } else if (beneficiary?.formStage === "OCCUPATION_DETAILS") {
      this.beneficiaryService.setRouteToDisplay("other details");
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'other_details'
        }
      })
    } else if (beneficiary?.formStage === "OTHER_DETAILS") {
      //|| beneficiary?.formStage === "COMPLETED"
      this.beneficiaryService.onboardingSubmitted(beneficiary?.phoneNumber)?.subscribe({
        next: (elem: any) => {
         // console.log('res>>', elem);
          this.router.navigate(['/home/all-beneficiary'], {
            relativeTo: this.route,
          });
          this.toast.setSuccessMessage("Beneficiary's onboarding has been completed successfully!");
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        },
        error: (err:any) => {
          console.error('err>>>', err);
          this.toast.setErrorMessage( err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
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
  }

  refreshPage(){
    location.reload();
  }

  nextPage() {
    this.paginationParams.page++;
    this.getAllBeneficiaries();
  }

  prevPage() {
    if (this.paginationParams.page > 0) {
      this.paginationParams.page--
      this.getAllBeneficiaries();
    }
  }

  getCurrentPage(pageNoToPull: number) {
    // console.log('current page>>', pageNoToPull);
    this.paginationParams.page = pageNoToPull;
    this.getAllBeneficiaries();
  }


  nextPage_() {
    this.paginationParams.page++;
    this.getAllIncompleteBeneficiaries();
  }

  prevPage_() {
    if (this.paginationParams.page > 0) {
      this.paginationParams.page--
      this.getAllIncompleteBeneficiaries();
    }
  }

  getCurrentPage_(pageNoToPull: number) {
    // console.log('current page>>', pageNoToPull);
    this.paginationParams.page = pageNoToPull;
    this.getAllIncompleteBeneficiaries();
  }
}
