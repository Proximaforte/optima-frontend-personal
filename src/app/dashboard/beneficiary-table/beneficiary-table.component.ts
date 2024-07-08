import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Beneficiary, PaginationParams, mocks } from 'src/app/models/beneficiary/beneficiary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { TotalOnboarding } from 'src/app/models/beneficiary/beneficiary';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiary-table',
  templateUrl: './beneficiary-table.component.html',
  styleUrls: ['./beneficiary-table.component.scss']
})
export class BeneficiaryTableComponent implements OnInit {

  beneficiary: Beneficiary[] = [];
  @Output() emitTotals$: EventEmitter<any> = new EventEmitter();
  noData: string = "/assets/images/emptydata.svg";
  check: string = "/assets/images/mark-icon.png";
  back: string = "/assets/images/arrow-left-circle.png";
  privacy: string = "/assets/images/privacy.png";
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

  @ViewChild('consentModal') consentModal!: TemplateRef<any>;

  showConsent: boolean = true; // Flag to toggle between consent and privacy policy

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  addBeneficiary() {
    const dialogRef = this.dialog.open(this.consentModal);

    dialogRef.afterClosed().subscribe(result => {
      this.showConsent = true; // Reset to consent view when modal is closed
      if (result === 'accept') {
        this.beneficiaryService.setRouteToDisplay("verify beneficiary nin");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'verify_NIN'
          }
        });
      }
    });
  }

  getAllBeneficiries() {
    this.beneficiaryService.getFilteredBeneficiaries(this.beneficiaryService.getFilterParams(), this.paginationParams).subscribe({
      next: (res: any) => {
        this.beneficiary = res?.data?.beneficiaries;
        this.totals.completed = res?.data?.beneficiaries?.length;
        this.emitTotals$.emit(this.totals);
      },
      error: (err: any) => {
        console.error("err>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if (err?.status === 401) this.authService.agentLogout();
      }
    });
  }

  getAllIncompletedBeneficiaries() {
    this.beneficiaryService.getAllIncompleteBeneficiaries(this.beneficiaryService.getFilterParams(), this.paginationParams).subscribe({
      next: (res: any) => {
        this.totals.incompleted = res?.data?.beneficiaries?.length;
        this.emitTotals$.emit(this.totals);
      },
      error: (err: any) => {
        console.error("err>>", err);
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if (err?.status === 401) this.authService.agentLogout();
      }
    });
  }

  ngOnInit(): void {
    this.getAllBeneficiries();
    this.getAllIncompletedBeneficiaries();
  }

  onCancel(): void {
    this.dialog.closeAll();
  }

  onAccept(): void {
    this.dialog.closeAll();
    this.router.navigate(['../beneficiary'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'verify_NIN'
      }
    });
  }

  toggleModalContent(): void {
    this.showConsent = !this.showConsent;
  }

  closePrivacyPolicy(): void {
    this.showConsent = true;
    this.dialog.closeAll();
  }
}
