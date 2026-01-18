import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
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

  userDetails:any = {};
  constructor(){
    const userDetails: any = localStorage.getItem("userDetails");
   // console.log("userDetails>>", JSON.parse(userDetails));
    this.userDetails = JSON.parse(userDetails);

    this.agents = [
      // { text: 'Agent code', data: this.userDetails?.center?.code, icon: 'assets/images/agentcode.svg' },
      {
        text: 'center',
        data: this.userDetails?.center?.name,
        icon: 'assets/images/center.svg',
      },

       { text: 'LGA', 
        data: this.userDetails?.center?.lga?.name, 
        icon: 'assets/images/lga.svg'
       },

      {
        text: 'center code',
        data: this.userDetails?.center?.code,
        icon: 'assets/images/centercode.svg',
      },

     
    ];
  }
}
