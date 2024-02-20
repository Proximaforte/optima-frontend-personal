import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  options: string[] = ['Today', 'Last 7days', 'This Month', 'Last 6 Months'];
  selectedValue: string = '';
}
