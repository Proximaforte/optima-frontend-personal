import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit, AfterViewInit {

  @ViewChild('personal-details') sectionToScrollTo!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;
  routeSubscription$!: Subscription;

  beneficiaryItems: String[] | any = [
    "verify beneficiary nin",
    "personal details",
    "verification procedure",
    "residential details",
    "marital info",
    "education",
    "education-second",
    "health",
    "financial",
    "next of kin",
    "employment",
    "occupation",
    "other details"
  ];
  selectedItemIndex: number | null = null;
  selectedItemName: string | null = null;
  isLinear = false;
  isDesktop: boolean = window.innerWidth >= 1024;
  
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ) {
    if (this.selectedItemName === null) {
      this.selectedItemName = 'verify beneficiary nin';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth >= 1024;
  }

  goToStep(stepIndex: number) {
    for (let i = stepIndex; i >= 0; i--) {
      this.stepper.selectedIndex = i;
      this.selectedItemIndex = stepIndex + 1;
    }
  }

  ngAfterViewInit(): void {
    if (this.stepper) {
      this.getRouteToDiplay();
    }

  }
  

  ngOnInit(): void {

    this.isDesktop = window.innerWidth >= 1024;
    this.route.queryParams.subscribe({
      next: (params: Params) => {
        const sectionToScrollTo = params['progress'];
        // if (sectionToScrollTo === 'personal_details') {
          this.scrollToSection(sectionToScrollTo);
        // }
      }
    });
  }

  getRouteToDiplay() {
    this.routeSubscription$ = this.routeService.getRouteToDisplay().subscribe({
      next: (route: any) => {
        this.selectedItemName = route;
        this.beneficiaryItems?.forEach((path: any, index: number) => {
          if (route === path) {
            this.goToStep(index - 1);
          }
        });
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.scrollTop = 0
      element.scrollTo(0, 0)
    }
  }

  isSelectedIndex(index: number): boolean {
    return this.selectedItemIndex === index;
  }

  itemClicked(index: number, selectedItemName: string) {
    this.selectedItemIndex = index;
  }

}
