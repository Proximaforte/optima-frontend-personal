import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { BeneficiaryProfile } from 'src/app/models/beneficiary/beneficiary';
import { Subscription } from 'rxjs';

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

  constructor(
    private beneficiaryService: BeneficiaryService
  ){}

  ngOnInit(): void {
    this.beneficiaryProfile$ = this.beneficiaryService.getBeneficiaryProfile().subscribe({
      next: (profileData: any) => {
        console.log('profile>>>', profileData);
        this.beneficiary = profileData;
      }
    })
  }
}
