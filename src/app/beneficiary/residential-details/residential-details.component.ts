import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NigerianStates, localGovt } from 'src/app/models/beneficiary/beneficiary';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-residential-details',
  templateUrl: './residential-details.component.html',
  styleUrls: ['./residential-details.component.scss']
})
export class ResidentialDetailsComponent implements OnInit {

  options: String[] = [
    "Does beneficiary own where he lives?*",
    "Yes, a house owner",
    "No, a tenant"
  ]

  states:string[] = NigerianStates;
  lga: any[] = localGovt;
  selectedState: string = '';
  residentialInfo!: FormGroup;
  selectedLGA: string[] = ["Select LGA*"];
  showOthers: boolean = false;
  userDetails: any = {};
  disableBtn: boolean = true;
  showSpinner: boolean = false;
  showWelcomeMsg:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService
  ){
    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);
    //console.log("userData>>>", JSON.parse(getUserData)); //phoneNumber

    const getMessage:any = sessionStorage.getItem('incomplete');
    if(getMessage !== null){
      this.showWelcomeMsg = true;
      setTimeout(() => {
        this.showWelcomeMsg = false;
        sessionStorage.removeItem('incomplete');
       }, 2500);
    }else{
       this.showWelcomeMsg = false;
    }
  }

  selectState(value: any){
   // console.log("selected state>>", this.selectedState);
  }

  residencyForm(){
    this.residentialInfo = new FormGroup({
      placeOfResidence: new FormControl('',[Validators?.required]),
      annualPay: new FormControl(0),
      address: new FormControl('',[Validators?.required]),
      selectState: new FormControl('',[Validators?.required]),
      selectLga: new FormControl('',[Validators?.required]),
    })

    this.residentialInfo.get('selectState')?.valueChanges.subscribe({
      next: (item:any) => {
        this.disableBtn = false;
        for(var i=0; i< this.lga?.length; i++){
          if(item === this.lga[i].state){
            this.selectedLGA = this.lga[i]?.localGovt;
            break;
          }
        }
      }
    })

    this.residentialInfo.get('placeOfResidence')?.valueChanges.subscribe({
      next: (value:any) => {
        if(value === "No, a tenant"){
            this.showOthers = true;
          }else{
            this.showOthers = false;
          }
      }
    })
    
  }

  ngOnInit(): void {
    this.residencyForm();
  }

  submitForm(){
    this.showSpinner = true;
    const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    const payload:any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      houseOwner: this.residentialInfo.value.placeOfResidence === "Yes, a house owner" ? true : this.residentialInfo.value.placeOfResidence ===  "No, a tenant" ? false : null,
      annualRent: this.residentialInfo.value?.annualPay,
      address: this.residentialInfo.value?.address,
      state: this.residentialInfo.value?.selectState,
      lga: this.residentialInfo.value?.selectLga
    }

   // console.log("data>>>", payload);
    this.beneficiaryService.residentialDetails(payload).subscribe({
      next: (res:any) => {
        this.showSpinner = false;
      //  console.log("res>>>", res);
        this.beneficiaryService.setRouteToDisplay("marital info");
        this.router.navigate(['/home/beneficiary'],{
          relativeTo: this.route,
          queryParams: {
            progress: 'marital_info'
          }
        })
        this.toast.setSuccessMessage('Beneficiary Residential Details is onboarded successfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      },
      error: (err:any) => {
        console.error("err>>", err);
        this.showSpinner = false;
        this.toast.setErrorMessage(err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        if(err?.status === 401){
        this.auth.agentLogout();
        }
      }
    })
  }
}
