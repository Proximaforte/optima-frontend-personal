import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  options: string[] | any = [
    "Beneficiary Disability type*","Vision impairment", "Deaf or hard of hearing", 
    "Dumb or speaking challenge", "Mental health conditions", "Intellectual disability", 
    "Acquired brain injury", "Physical disability", "Autism spectrum disorder",
     "Cerebral palsy","Stroke", "Spina bifida",
    "Arthritis", "Spinal cord injury", "Others"
  ]
  previousHealthData: any = {};
  userDetails:any = {};
  showSpinner:boolean = false;
  disableBtn: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth:AuthService
  ){
    const getParams = this.route.queryParams.subscribe({
      next: (params: any) => {
       // console.log("query params>>>", JSON.parse(params?.data));
        this.previousHealthData = JSON.parse(params?.data);
      }
    });

    const getUserData:any = localStorage.getItem('userDetails');
     this.userDetails = JSON.parse(getUserData);
  }

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

  getDropdownEnums(){
    this.beneficiaryService.getHealthAilmentsDropdown().subscribe({
      next: (item: any) => {
        this.options = new Set(["Beneficiary Disability type*"].concat(item.data));
       // console.log('options sets>>', this.options);
      }
    })
  }

  ngOnInit(): void {
    this.getDisabilityForm();
    this.getDropdownEnums();
  }

  getDisabilityForm(){
    this.disabilityForm = new FormGroup({
      disabilityType: new FormControl('', [Validators.required]),
      disability: new FormControl(this.showInputBox === true ? '' : null, [Validators.required])
    })

    this.disabilityForm?.get('disabilityType')?.valueChanges.subscribe({
      next: (value: string) => {
      //  console.log("innerValue>>", value);
      this.disableBtn = false;
        if(value === 'Others'){
          this.showInputBox = true;
        }else{
          this.showInputBox = false;
        }

     


      }
    })
  }
  

  submit(){
    this.showSpinner = true;
    const healthPayload = {
      ...this.previousHealthData,
      idDisabled: this.showActive,
      disableType: this.disabilityForm.value?.disabilityType,
      specifyDisabled: this.disabilityForm.value?.disability 
    }

    const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');

    const newHealthPayload: any = {
      phoneNumber: getBeneficiaryPhoneNumber,
      healthCondition: healthPayload?.healthCondition,
      healthAilment: healthPayload?.healthQuestion,
      specifyAilment: healthPayload?.specifyAilment,
      hasHMO: healthPayload?.HMOQuestion === 'no' ? false : healthPayload?.HMOQuestion === 'yes' ? true : null,
      hmoName:healthPayload?.specifyHMO,
      hospitalEnrolled: healthPayload?.publicHospitalQuestion,
      receivingTreatment: healthPayload?.receivingTreatmentQuestion === 'no' ? false : healthPayload?.receivingTreatmentQuestion === 'yes' ? true : null,
      disabled: healthPayload?.idDisabled,
      disableType: healthPayload?.disableType,
      specifyDisabled: this.disabilityForm.value?.disabilityType === 'Others' ? healthPayload?.specifyDisabled : null
    }

   //console.log('health payload>>>', newHealthPayload);
    this.beneficiaryService.healthDetails(newHealthPayload).subscribe({
      next: (res: any) => {
        //console.log("res>>", res);
        this.showSpinner = false;
        this.toast.setSuccessMessage('Beneficiary Health data is onboarded successfully!');
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        this.beneficiaryService.setRouteToDisplay("financial");
        this.router.navigate(['/home/beneficiary'], { 
          relativeTo: this.route,
          queryParams: {
            progress: "financial"
          }
        });
      },
      error: (err: any) => {
        console.error("err123>>>", err);
        this.showSpinner = false;
        this.toast.setErrorMessage( err?.error?.responseMessage || err?.error?.failureReason || err?.statusText || "Oops an error occured!");
        this.toast.setSuccessMessage( err?.error?.responseMessage || err?.error?.failureReason || err?.statusText || "Oops an error occured!");
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
