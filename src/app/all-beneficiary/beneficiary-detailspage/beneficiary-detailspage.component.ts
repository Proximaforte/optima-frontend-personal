import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { BeneficiaryProfile } from 'src/app/models/beneficiary/beneficiary';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

@Component({
  selector: 'app-beneficiary-detailspage',
  templateUrl: './beneficiary-detailspage.component.html',
  styleUrls: ['./beneficiary-detailspage.component.scss'],
})
export class BeneficiaryDetailspageComponent implements OnInit{
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
  
  beneficiaryProfile$!: Subscription;
  beneficiary!: BeneficiaryProfile;
  ssid: string = '';
  showSpinner: boolean = true;

  constructor(
    private beneficiaryService: BeneficiaryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ){
  const params = this.route.queryParams.subscribe({
    next: (param: any) => {
      this.ssid = param?.data;
      console.log('param>>', this.ssid);
    }
  })
  }

  getBeneficiaryProfileData(){
    this.beneficiaryService.getAllBeneficiaryProfiles(this.ssid).subscribe({
      next: (data: any) => {
        this.showSpinner = false;
       //console.log('data>>', data);  
       this.beneficiary = data?.data;  
        this.toast.setSuccessMessage( "Data retrieved successfully!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error("Http error from beneficiary profile>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      }
    })
    
  }

  getDummyData(){
    this.showSpinner = false;
    this.beneficiaryProfile$ = this.beneficiaryService.getBeneficiaryProfile().subscribe({
      next: (profileData: any) => {
        //console.log('profile>>>', profileData);
        this.beneficiary = profileData;
      }
    })
  }

  ngOnInit(): void {
   if(this.ssid === undefined){
    this.getDummyData();
   }else{
    this.getBeneficiaryProfileData();
   }
  }
}
