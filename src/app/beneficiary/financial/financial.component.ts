import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';


@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit{

  financialInfoForm!: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}

   
  options: string[] = [
    "Are you the bread winner of the household?*",  "Yes",  "No"
  ]

  option2: string[] = [
    "Average amount spent monthly by household*",  "Less than 250k",  "250k - 500k",  "500k - 1M",  "1M and above", "I don't know"
  ]

  option4: string[] = [
    "What is your monthly household income*","Less than 250k",  "250k - 500k",  "500k - 1M",  "1M and above", "I don't know"
  ]

  option3: string[] = [
    "Have you received financial aid before*",  "Yes",  "No"
  ]

  option5: string[] = [
    "If yes, please specify*",  "Education",  "Medicals",  "Financial",  "Transportation", "None of the above"
  ]
  showOthers: boolean = false;

  ngOnInit(): void {
    this.getFinancialForm();
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
        if(value === "Yes"){
          this.showOthers = true;
        }else{
          this.showOthers = false;
        }
      }
    })

  }

  submit(){
    this.routeService.setRouteToDisplay("next of kin");
    this.router.navigate(['/home/beneficiary'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'next_of_kin'
      }
    });
  }
}
