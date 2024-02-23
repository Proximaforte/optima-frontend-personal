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
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    const userData: any = this.authService.getAgentData();
    const parseData = JSON.parse(userData);
    this.userName = parseData?.name
  }

  ngOnInit(): void {
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
          this.name = this.userName;
        } else if(
          routePath === 'beneficiary' || 
          routePath === 'verification-code' ||
          routePath === 'setup-biometrics' ||
          routePath === 'face-capturing' ||
          routePath === 'finger-capturing'
          ) {
          this.title = route.snapshot.data['title'];
          this.name = '(State Palliative Disbursement)';
          this.subPath = 'Add beneficiaries'
        }else if(routePath === 'all-beneficiary') {
          this.title = route.snapshot.data['title'];
          this.name = '';
          this.subPath = 'onboarded beneficiaries'
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
