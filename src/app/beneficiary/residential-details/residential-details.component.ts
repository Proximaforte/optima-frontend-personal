import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NigerianStates, localGovt } from 'src/app/models/beneficiary/beneficiary';

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
  constructor(){}

  selectState(value: any){
    console.log("selected state>>", this.selectedState);
  }

  residencyForm(){
    this.residentialInfo = new FormGroup({
      placeOfResidence: new FormControl('',[Validators?.required]),
      annualPay: new FormControl(''),
      address: new FormControl('',[Validators?.required]),
      selectState: new FormControl('',[Validators?.required]),
      selectLga: new FormControl('',[Validators?.required]),
    })

    this.residentialInfo.get('selectState')?.valueChanges.subscribe({
      next: (item:any) => {
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
    console.log("data>>>", this.residentialInfo.value);
  }
}
