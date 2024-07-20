import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from '../interface/u.i';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from '../modals/logout/logout.component';
import { Location } from '@angular/common';  // Import Location
import {ConsentModalComponent} from '../../consent-modal/consent-modal.component'




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  bankLogo: any;
  hovered?: boolean;
  client: string = 'zest';
  warn: string = "/assets/images/warn.svg";
  back: string = "/assets/images/arrow-left-circle.png";
  privacy: string = "/assets/images/privacy.png";
  menuItems: MenuItem[] | any = [
    {
      icon: 'assets/images/dashboard.svg',
      name: 'dashboard',
      route: '/home/dashboard',
    },
    {
      icon: 'assets/images/user.svg',
      name: 'beneficiary',
      route: '/home/beneficiary',
    },
    {
      icon: 'assets/images/UserList.svg',
      name: 'all-beneficiary',
      route: '/home/all-beneficiary',
    },
    // {
    //   icon: 'assets/images/profile.svg',
    //   name: 'profile',
    //   route: '/home/profile',
    // },
    {
      icon: 'assets/images/Icon.svg',
      name: 'logout',
      route: '/auth/login',
    },
  ];

  @ViewChild('consentModal') consentModal!: TemplateRef<any>;

  showConsent: boolean = true; // Flag to toggle between consent and privacy policy

  constructor(
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private dialog: MatDialog,
    private location: Location  
  ) {
    this.bankLogo = this.sanitizer.bypassSecurityTrustUrl(
      `assets/images/homelogo.svg`
    );
    this.menuItems.forEach((item: any) => {
      this.iconRegistry.addSvgIcon(
        item.name,
        sanitizer.bypassSecurityTrustResourceUrl(item.icon as string)
      );
    });
  }

 

  ngOnInit(): void { }
  isActive(route: string | undefined): boolean {
    return !!route && this.router.isActive(route, false);
  }

  onLogout(item: any) {
    if (item?.name === 'logout') {
      this.dialog.open(LogoutComponent, {
        height: '200px',
        width: '500px',
        
      });
    } else if (item?.name === 'beneficiary') {
      this.routeService.setRouteToDisplay('verify beneficiary nin');
      this.dialog.open(ConsentModalComponent, );
    } else if (item?.name === 'dashboard') {
      this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
      setTimeout(() => location?.reload(), 300);
    } else if (item?.name === 'all-beneficiary') {
      this.router.navigate(['/home/all-beneficiary'], { relativeTo: this.route });
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
