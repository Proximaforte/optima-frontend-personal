import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';


@Component({
  selector: 'app-disability-status',
  templateUrl: './disability-status.component.html',
  styleUrls: ['./disability-status.component.scss']
})
export class DisabilityStatusComponent implements OnInit{

  hovered: string = "/assets/images/btn_hover.svg";
  disabled: string = "/assets/images/disabled_btn.svg";
  yes: string = "/assets/images/yes_btn.svg";
  showActive: boolean = false;
  disabilityForm!: FormGroup;
  showInputBox: boolean = false;

  options: string[] = [
    "Beneficiary Disability type*","Vision impairment", "deaf or hard of hearing", "Dumb or speaking challenges", "Mental health conditions", "Intellectual disability", "Acquired brain injury", "Physical disability", "autism spectrum disorder", "Cerebral palsy","Stroke", "Spinal bifida",
    "Athritis", "Spinal cord injury", "Others"
  ]
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ){}

  showYes(){
    this.showActive = true;
  }

  showNull(){
   if(this.showActive === true){
    this.showActive = false;
   }else{
    this.submit();
   }
  }

  ngOnInit(): void {
    this.getDisabilityForm();
  }

  getDisabilityForm(){
    this.disabilityForm = new FormGroup({
      disabilityType: new FormControl('', [Validators.required]),
      disability: new FormControl(this.showInputBox === true ? '' : null, [Validators.required])
    })

    this.disabilityForm?.get('disabilityType')?.valueChanges.subscribe({
      next: (value: string) => {
        console.log("innerValue>>", value);
        if(value === 'Others'){
          this.showInputBox = true;
        }else{
          this.showInputBox = false;
        }
      }
    })
  }
  

  submit(){
    this.routeService.setRouteToDisplay("financial");
    this.router.navigate(['/home/beneficiary'], { 
      relativeTo: this.route,
      queryParams: {
        progress: "financial"
      }
    });
  }


}
