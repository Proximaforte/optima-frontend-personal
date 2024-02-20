import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  title: string = '';
  name: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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
          this.name = 'shadrack';
        } else {
          this.title = route.snapshot.data['title'];
          this.name = '(State Disbursement Palliative)';
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
