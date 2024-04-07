import { Component, ElementRef, ViewChild, OnInit , AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

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
    "health",
    "financial",
    "next of kin",
    "employment",
    "occupation",
    "other details"
  ]
  selectedItemIndex: number | null = null;
  selectedItemName: string | null = null;
  isLinear = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routeService: BeneficiaryService
  ) {
    if (this.selectedItemName === null) {
      this.selectedItemName = 'verify beneficiary nin';
    }
  }

  goToStep(stepIndex: number) {
    for (let i = stepIndex; i >= 0; i--) {
      console.log(`Going to step ${i}`);
      this.stepper.selectedIndex = i;
      this.selectedItemIndex = stepIndex + 1;
     // console.log("stepIndex>>", stepIndex);
    }
  }

  ngAfterViewInit(): void {
    if (this.stepper) {
      console.log('Stepper is initialized and available.');
      this.getRouteToDiplay();
    }
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params: Params) => {
        const sectionToScrollTo = params['progress'];
        //  console.log('params>>', sectionToScrollTo);
        if (sectionToScrollTo === 'personal_details') {
          this.scrollToSection(sectionToScrollTo);
        }
      }
    });
  }

  getRouteToDiplay() {
    this.routeSubscription$ = this.routeService.getRouteToDisplay().subscribe({
      next: (route: any) => {
        this.selectedItemName = route;
        const loopedRoute = this.beneficiaryItems?.forEach((path: any, index: number) => {
          if (route === path) {
            this.goToStep(index - 1);
          }
        })
      }
    })
  }



  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isSelectedIndex(index: number): boolean {
    return this.selectedItemIndex === index;
  }



  itemClicked(index: number, selectedItemName: string) {
    this.selectedItemIndex = index;
    if (index + 1 === 1) {
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "verify_NIN" } });
      this.selectedItemName = selectedItemName;
      sessionStorage.removeItem('biometrics');
    } else if (index + 1 === 2) {
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "personal_details" } });
      this.selectedItemName = selectedItemName;
      sessionStorage.removeItem('biometrics');
    }else if (index + 1 === 3) {
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "enter_verification_code" } });
      this.selectedItemName = selectedItemName;
      sessionStorage.removeItem('biometrics');
    } else if (index + 1 === 4) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "residential_details" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 5) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "marital_info" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 6) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "education" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 7) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "health" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 8) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "financial" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 9) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "next_of_kin" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 10) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "employment" } });
      this.selectedItemName = selectedItemName;
    } else if (index + 1 === 11) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "occupation" } });
      this.selectedItemName = selectedItemName;
    }  else if (index + 1 === 12) {
      sessionStorage.removeItem('biometrics');
      this.router.navigate([window?.location?.pathname], { relativeTo: this.route, queryParams: { progress: "other_details" } });
      this.selectedItemName = selectedItemName;
    }else if(sessionStorage.getItem('biometrics') === 'biometrics'){
      this.router.navigate(['/home/face-capturing'], { relativeTo: this.route, queryParams: { progress: "face_capturing" } });
      this.selectedItemName = 'biometrics';
    }
  }


}
