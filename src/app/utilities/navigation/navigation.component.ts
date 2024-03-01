import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from '../interface/u.i';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
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
      route: '/home/dashboard',
    },
    {
      icon: 'assets/images/onboarding.svg',
      name: 'beneficiary',
      route: '/home/beneficiary',
    },
    {
      icon: 'assets/images/beneficiaries.svg',
      name: 'all-beneficiary',
      route: '/home/all-beneficiary',
    },
    {
      icon: 'assets/images/profile.svg',
      name: 'profile',
      route: '/home/profile',
    },
    {
      icon: 'assets/images/logout.svg',
      name: 'logout',
      route: '/auth/login',
    },
  ];



  constructor(
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
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

  onLogout(item: any) {
    if(item?.name === "logout"){
      // this.router.navigate([item?.route]);
      this.authService.agentLogout()
    }else if(item?.name === "beneficiary"){
      this.routeService.setRouteToDisplay("verify beneficiary nin");
      this.router.navigate(['/home/beneficiary'],{
        relativeTo: this.route,
        queryParams: {
          progress: 'verify_NIN'
        }
      })
    }
  }

  //  // Define a boolean array to track active states of items
  //  isActive: boolean[] = new Array(this.menuItems.length).fill(false);

  //  // Method to toggle the active state of an item
  //  toggleActive(index: number): void {
  //   this.isActive[index] = !this.isActive[index];
  //   console.log('isActive:', this.isActive);
  // }


  


  // https://chat.openai.com/c/140447e6-5ce5-416a-a70f-675c8380df52
}
