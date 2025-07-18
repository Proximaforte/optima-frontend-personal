import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TotalOnboarding } from '../models/beneficiary/beneficiary';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastsComponent } from '../utilities/toasts/toasts.component';
import { ToastsService } from '../services/alert/toasts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';  // Import Location
import {ConsentModalComponent} from 'src/app/consent-modal/consent-modal.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {


  calendar: string = "/assets/images/calendar.svg";
    plusIcon: string = "assets/icons/PlusCircle.svg";
    continueIcon: string = "assets/icons/support.svg";
    agentIcon: string = "assets/icons/chat.svg";
  total: number = 945;
  options: string[] = ['Today', 'Last 7days', 'This Month', 'Last 6 Months'];
  selectedValue: string = '';
  isOpen: any;
  totalOnboarding: TotalOnboarding | any = {
    completed: 0,
    incompleted: 0
  };
  agentData: {} = {};
  showSpinner: boolean = true;


  agents: any = [
   
  ];

  dashBoardDropdown!: FormGroup;
  statsApiHasError: boolean = false;
   @ViewChild('consentModal') consentModal!: TemplateRef<any>;
  
    showConsent: boolean = true;

  constructor(
    private router: Router,
     private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private dialog: MatDialog, 
  ) {
  }


  
  openConsentModal() {
    this.dialog.open(ConsentModalComponent, );
  }
  
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

  acceptTableTotals(event: any) {
    if (this.statsApiHasError == true) {
      this.totalOnboarding = event;
      // console.log('event>>>', this.totalOnboarding);
      this.totalOnboarding.completed = String(event.completed);
      this.totalOnboarding.incompleted = String(event.incompleted);
      if (event.completed > 0) {
        this.showSpinner = false;
      }

    }

  }

  getDashboardForm() {
    this.dashBoardDropdown = new FormGroup({
      dateType: new FormControl('Today')
    })

    this.dashBoardDropdown.get('dateType')?.valueChanges.subscribe({
      next: (item: any) => {
        this.beneficiaryService.getDashboardStats(item).subscribe({
          next: (res: any) => {
            this.showSpinner = false;
            this.totalOnboarding.completed = String(res?.data?.completedOnboarding);
            this.totalOnboarding.incompleted = String(res?.data?.incompleteOnboarding);
            // this.agentData = res?.data;
            this.agents = [
              { text: 'Agent code', data: `${res?.data?.center?.agentCode}`, icon: 'assets/images/agentcode.svg' },
              {
                text: 'center',
                data: `${res?.data?.center?.centerName}`,
                icon: 'assets/images/center.svg',
              },
              {
                text: 'center code',
                data: `${res?.data?.center?.centerCode}`,
                icon: 'assets/images/centercode.svg',
              },
              {
                text: 'LGA',
                data: `${res?.data?.center?.address},${res?.data?.center?.lga}, ${res?.data?.center?.state}`,
                icon: 'assets/images/lga.svg'
              }
            ];
          },
          error: (err: any) => {
            console.error("dashbord err>>>", err);
            if (err) {
            setTimeout(() => {
              this.statsApiHasError = true;
              this.toast.setErrorMessage(err?.error?.responseMessage ?? 'Oops an error occured!');
              this.snackbar.openFromComponent(ToastsComponent, {
                duration: 4000,
                verticalPosition: 'bottom',
              });
            }, 2000)
            }
          }
        })
      }
    })

  }


  getReportRanges() {
    this.beneficiaryService.getReportRanges().subscribe({
      next: (res: any) => {
        this.options = res?.data;
      }
    })
  }

  getDefaultDashboardStats() {
    this.beneficiaryService.getDashboardStats('Today').subscribe({
      next: (res: any) => {
        //  console.log("response>>>", res?.data);
        this.showSpinner = false;
        this.totalOnboarding.completed = String(res?.data?.completedOnboarding);
        this.totalOnboarding.incompleted = String(res?.data?.incompleteOnboarding);
        // this.agentData = res?.data;
        this.agents = [
          { text: 'Agent code', data: `${res?.data?.center?.agentCode}`, icon: 'assets/images/agentcode.svg' },
          {
            text: 'center',
            data: `${res?.data?.center?.centerName}`,
            icon: 'assets/images/center.svg',
          },
          {
            text: 'center code',
            data: `${res?.data?.center?.centerCode}`,
            icon: 'assets/images/centercode.svg',
          },
          {
            text: 'LGA',
            data: `${res?.data?.center?.address},${res?.data?.center?.lga}, ${res?.data?.center?.state}`,
            icon: 'assets/images/lga.svg'
          }
        ];
      },
      error: (err: any) => {
        console.error("dashbord err>>>", err);
        if (err) {
          this.statsApiHasError = true;
          this.toast.setErrorMessage(err?.error?.responseMessage ?? 'Oops an error occured!');
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        }
      }
    })
  }

  ngOnInit(): void {
    // this.getReportRanges();
    this.getDashboardForm();
    this.getDefaultDashboardStats();
  }


}
