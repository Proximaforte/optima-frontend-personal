import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from '../interface/u.i';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  bankLogo: any;
  hovered?: boolean;
  client: string = 'zest';
  menuItems: MenuItem[] = [
    {
      icon: 'assets/images/dashboard.svg',
      name: 'dashboard',
      route: 'dashboard',
    },
    {
      icon: 'assets/images/onboarding.svg',
      name: 'onboard',
      route: 'onboarding',
    },
    {
      icon: 'assets/images/beneficiaries.svg',
      name: 'benefeciary',
      route: 'beneficiary',
    },
    {
      icon: 'assets/images/profile.svg',
      name: 'profile',
      route: 'profile',
    },
    {
      icon: 'assets/images/logout.svg',
      name: 'logout',
      route: 'logout',
    },
  ];



  constructor(
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,

    private router: Router
  ) {
    this.bankLogo = this.sanitizer.bypassSecurityTrustUrl(
      `assets/images/info.svg`
    );
    this.menuItems.forEach((item) => {
      this.iconRegistry.addSvgIcon(
        item.name,
        sanitizer.bypassSecurityTrustResourceUrl(item.icon as string)
      );
    });
  }



  ngOnInit(): void {}
  isActive(route: string | undefined): boolean {
    return !!route && this.router.isActive(route, false);
  }

  onLogout() {}

  //  // Define a boolean array to track active states of items
  //  isActive: boolean[] = new Array(this.menuItems.length).fill(false);

  //  // Method to toggle the active state of an item
  //  toggleActive(index: number): void {
  //   this.isActive[index] = !this.isActive[index];
  //   console.log('isActive:', this.isActive);
  // }
  

  // https://chat.openai.com/c/140447e6-5ce5-416a-a70f-675c8380df52
}
