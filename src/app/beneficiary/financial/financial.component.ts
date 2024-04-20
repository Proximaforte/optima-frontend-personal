import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit{

  financialInfoForm!: FormGroup;
  options: string[] = [
    "Are you the bread winner of the household?*",  "yes",  "no"
  ]

  option2: string[] | any = [
    "Average amount spent monthly by household*",  "0 - 50K",  "50K - 100K",  "100K - 250K", "250K - 500K",  "500K - 1M",  "1M & above", "I don't know"
  ]

  option4: string[] |  any = [
    "What is your monthly household income*", "0 - 50K",  "50K - 100K",  "100K - 250K", "250K - 500K",  "500K - 1M",  "1M & above", "I don't know"
  ]

  option3: string[] = [
    "Have you received financial aid before*",  "yes",  "no"
  ]

  option5: string[] | any = [
    "If yes, please specify*",  "Education",  "Medical",  "Financial",  "Transportation", "None of the above, others"
  ]
  showOthers: boolean = false;
  userDetails:any = {};
  showSpinner:boolean = false;
  showWelcomeMsg:boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const getUserData:any = localStorage.getItem('userDetails');
     this.userDetails = JSON.parse(getUserData);

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

   getDropdownItems(){
    this.beneficiaryService.getMoneyRangeDropdown().subscribe({
      next: (item: any) => {
        this.option2 = new Set([ "Average amount spent monthly by household*",  "0 - 50K",  "50K - 100K",  "100K - 250K", "250K - 500K",  "500K - 1M",  "1M & above", "I don't know"].concat(item.data));
        this.option4 = new Set(["What is your monthly household income*", "0 - 50K",  "50K - 100K",  "100K - 250K", "250K - 500K",  "500K - 1M",  "1M & above", "I don't know"].concat(item.data));
      }
    })

    this.beneficiaryService.getAideDropdown().subscribe({
      next: (item: any) => {
        this.option5 = new Set(["If yes, please specify*",  "Education",  "Medical",  "Financial",  "Transportation", "None of the above, others"].concat(item.data));
      }
    })
   }


  ngOnInit(): void {
    this.getFinancialForm();
    this.getDropdownItems();
  }

  getFinancialForm(){
    this.financialInfoForm = new FormGroup({
      breadWinner: new FormControl('', [Validators.required]),
      houseHoldIncome: new FormControl('', [Validators.required]),
      averageAmtSpent: new FormControl('', [Validators.required]),
      financialAid: new FormControl('', [Validators.required]),
      ifYes: new FormControl('', [Validators.required]),
    })

    this.financialInfoForm.get('financialAid')?.valueChanges.subscribe({
      next: (value: string) => {
      //  console.log("item>>>", value);
        if(value === "yes"){
          this.showOthers = true;
        }else{
          this.showOthers = false;
        }
      }
    })

  }

  submit(){
   this.showSpinner = true;
   const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    const payload:any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      breadwinner: this.financialInfoForm.value?.breadWinner === 'yes' ? true : this.financialInfoForm.value?.breadWinner === 'no' ? false : null,
      monthlyIncome: this.financialInfoForm.value?.houseHoldIncome,
      monthlyExpenses: this.financialInfoForm.value?.averageAmtSpent,
      receivedAid: this.financialInfoForm.value?.financialAid === 'yes' ? true : this.financialInfoForm.value?.financialAid === 'no' ? false : null,
      specifyAid: this.financialInfoForm.value?.ifYes
    }

  //  console.log('data>>', payload);
    this.beneficiaryService.financialDetails(payload).subscribe({
      next: (item: any) => {
      //  console.log('item>>>', item);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Financial data onboarded successfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("next of kin");
        this.router.navigate(['/home/beneficiary'], {
          relativeTo: this.route,
          queryParams: {
            progress: 'next_of_kin'
          }
        });
      },
      error: (err: any) => {
        console.error('err from financial details onbording>>', err);
        this.showSpinner = false;
        this.toast.setErrorMessage( err?.error?.responseMessage || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });

          // if(err?.status === 401){
        //   this.auth.agentLogout();
        //   }
      }
    })
 
  }
}
