import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  title: string = '';
  name: string = '';
  userName: string = '';
  subPath: string = '';
  pathName: string = '';
  showBeneficiary: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    // console.log('window>>>', window?.location?.pathname);
    let path: any = window.location.pathname;
    path = '/home/beneficiary' ? this.showBeneficiary === true :
      path === '/home/all-beneficiary' ? this.showBeneficiary === false :
        path === '/home/dashboard' ? this.showBeneficiary === false :
          path === '/home/profile' ? this.showBeneficiary === false : null
  }

  getUserDetails() {
    this.authService.getUserDetails().subscribe({
      next: (res: any) => {
        // console.log("user details>>", `${res?.data.firstname} ${res?.data.middleName} ${res?.data.lastname}`);
        this.userName = `${res?.data.firstname} ${res?.data.lastname}`; // ${res?.data.middleName}
        // this.name = `${res?.data.firstname} ${res?.data.lastname}`; //${res?.data.middleName} 
      },
      error: (err: any) => {
        console.error("err from get user details>>>", err);
        if (err?.status === 401) {
          this.authService.agentLogout();
        }
      }
    })
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.activatedRoute.url)
      )
      .subscribe(() => {
        let route = this.activatedRoute;
        let routePath = '';
        while (route) {
          if (route.snapshot.routeConfig?.path) {
            routePath = route.snapshot.routeConfig.path;
            break;
          }
          route = route.firstChild!;
        }

        if (routePath === 'profile' || routePath === 'dashboard') {
          this.title = 'Good ' + this.getTimeOfDay();
          //  this.userName; (State Palliative Disbursement)
        } else if (
          routePath === 'beneficiary' ||
          routePath === 'verification-code' ||
          routePath === 'setup-biometrics' ||
          routePath === 'face-capturing' ||
          routePath === 'finger-capturing' ||
          routePath === 'finger-capturing-procedure' ||
          routePath === 'disability-status' ||
          routePath === 'financial-status'
        ) {
          this.title = route.snapshot.data['title'];
          this.name = '(State Palliative Disbursement)';
          this.subPath = 'Add beneficiaries';
          this.showBeneficiary = true;
        } else if (routePath === 'all-beneficiary') {
          this.title = route.snapshot.data['title'];
          this.name = '';
          this.subPath = 'onboarded beneficiaries';
        } else if (routePath === 'beneficiary-details') {
          this.title = 'Beneficiary Information';

          this.name = '';
          this.subPath = 'onboarded beneficiaries';
        }
      });
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Morning, ';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon, ';
    } else {
      return 'Evening,';
    }
  }
}
