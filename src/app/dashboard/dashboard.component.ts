import { Component } from '@angular/core';
import { TotalOnboarding } from '../models/beneficiary/beneficiary';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {


  calendar: string = "/assets/images/calendar.svg";
  total: number = 945;
  options: string[] = ['Today', 'Last 7days', 'This Month', 'Last 6 Months'];
  selectedValue: string = '';
  isOpen: any;
  totalOnboarding: TotalOnboarding | any = {
    completed: 0,
    incompleted: 0
  };


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

  constructor() {
  }

  acceptTableTotals(event: any) {
    this.totalOnboarding = event;
   // console.log('event>>>', this.totalOnboarding);
    this.totalOnboarding.completed = String(event.completed);
    this.totalOnboarding.incompleted = String(event.incompleted);
  }



}
