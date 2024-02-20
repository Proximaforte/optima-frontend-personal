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
  client: string = 'zest';
  menuItems: MenuItem[] = [
    {
      icon: 'assets/dashboard.svg',
      name: 'dashboard',
      route: 'dashboard',
    },
    {
      icon: 'assets/onboarding.svg',
      name: 'onboard',
      route: 'onboarding',
    },
    {
      icon: 'assets/beneficiaries.svg',
      name: 'benefeciary',
      route: 'beneficiary',
    },
    {
      icon: 'assets/profile.svg',
      name: 'profile',
      route: 'profile',
    },
    {
      icon: 'assets/logout.svg',
      name: 'logout',
      route: 'logout',
    },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,

    private router: Router
  ) {
    this.bankLogo = this.sanitizer.bypassSecurityTrustUrl(`assets/info.svg`);
    this.menuItems.forEach((item) => {
      this.iconRegistry.addSvgIcon(
        item.name,
        sanitizer.bypassSecurityTrustResourceUrl(item.icon as string)
      );
    });
  }

  ngOnInit(): void {}

  onLogout() {}
}
