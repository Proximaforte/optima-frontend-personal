import { Component, OnInit } from '@angular/core';
import { TotalOnboarding } from '../models/beneficiary/beneficiary';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastsComponent } from '../utilities/toasts/toasts.component';
import { ToastsService } from '../services/alert/toasts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {


  calendar: string = "/assets/images/calendar.svg";
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

  dashBoardDropdown!: FormGroup;
  statsApiHasError: boolean = false;

  constructor(
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
  ) {
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

    // if(this.dashBoardDropdown.get('dateType')?.value?.length === 0){
    //   this.getDefaultDashboardStats();
    // }
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
    // this.getDashboardForm();
    // this.getDefaultDashboardStats();
  }


}
