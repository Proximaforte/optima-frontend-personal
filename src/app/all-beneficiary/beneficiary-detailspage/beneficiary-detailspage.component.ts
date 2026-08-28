import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { BeneficiaryProfile } from 'src/app/models/beneficiary/beneficiary';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { ProfileService } from 'src/app/services/profile/profile.service';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-beneficiary-detailspage',
  templateUrl: './beneficiary-detailspage.component.html',
  styleUrls: ['./beneficiary-detailspage.component.scss'],
})
export class BeneficiaryDetailspageComponent implements OnInit, AfterViewInit {
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

  profileImage: string = 'assets/images/profilepic.svg';
  beneficiaryProfile$!: Subscription;
  beneficiary!: BeneficiaryProfile | any;
  ssid: string = '';
  showSpinner: boolean = true;
  capturedFingerprint: boolean = false;
  beneficiaryData: any = {};
  timestamp = Date.now();

  constructor(
    private beneficiaryService: BeneficiaryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private profileService: ProfileService,
      private router: Router,
  ) {
    const params = this.route.queryParams.subscribe({
      next: (param: any) => {
        this.ssid = param?.data;
        // console.log('param>>', this.ssid);
      }
    })
  }

  convertToPDF(pageId: string, dimension: any, page: string) {
    const element: any = document.getElementById(pageId);
    html2canvas(element, { scrollX: 0, scrollY: 0, windowWidth: document.documentElement.scrollWidth, windowHeight: document.documentElement.scrollHeight }).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0, dimension?.width, dimension?.height);
      let beneficiaryName = `${this.beneficiary.firstname}_${this.beneficiary.lastname}_optima_beneficiary_${page}.pdf`;
      pdf.save(beneficiaryName);
    });
  }

  ngAfterViewInit(): void {
    const imageElement = this.el.nativeElement.querySelector('#spinner');
    this.renderer.addClass(imageElement, 'hidden');
  }

  getBeneficiaryProfileData() {
    this.beneficiaryService.getAllBeneficiaryProfiles(this.ssid).subscribe({
      next: (data: any) => {
        // console.log('data>>', data); 
        //  console.log('API profile>>>', data);
        this.profileImage = data?.data?.base64Image !== null ? `data:image/png;base64,${data?.data?.base64Image}` : 'assets/images/profilepic.svg'; // `data:image/png;base64,${data?.data?.base64Image}`;
        //https://base64.guru/converter/decode/image
        this.beneficiary = data?.data;
        this.capturedFingerprint = this.beneficiary?.fingerprintCaptured;
        // console.log("fingerprintCaptured>>>", this.beneficiary?.fingerprintCaptured);
        this.toast.setSuccessMessage("Data retrieved successfully!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
        setTimeout(() => this.showSpinner = false, 2000);
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error("Http error from beneficiary profile>>", err);
        this.toast.setErrorMessage(err?.error?.failureReason || err?.error?.responseMessage || err?.statusText || "Oops an error occured!");
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
        });
      }
    })

  }

  getDummyData() {
    this.showSpinner = false;
    this.beneficiaryProfile$ = this.beneficiaryService.getBeneficiaryProfile().subscribe({
      next: (profileData: any) => {
        // console.log('dummy profile>>>', profileData);
        this.beneficiary = profileData;
        this.profileImage = profileData.base64Image !== null ? `data:image/png;base64,${profileData.base64Image}` : 'assets/images/profilepic.svg';
      }
    })
  }

  routeToCompleteBiometrics(beneficiary: any){
    let jwt:any = this.authService.getAgentData();
    let payload:any = {
      token: jwt,
      name: beneficiary?.fullName,
      nin: beneficiary?.nin,
      dob: beneficiary?.dateOfBirth
    }
   this.profileService.encryptJSONPayload(payload);
   setTimeout(() => window.location.reload(), 2000)
  }

  ngOnInit(): void {
    this.beneficiaryData = this.beneficiaryService.getBeneficiary();
  
  }

  
  showContinueOnboarding(beneficiary:  any): boolean {
    return (
      beneficiary?.formStage !== 'OTHER_DETAILS' &&
      beneficiary?.registrationType === 'AGENT'
    );
  }

  showManualValidationRequest(beneficiary:  any): boolean {
    return (
      beneficiary?.formStage === 'OTHER_DETAILS' &&
      beneficiary?.biometricMatch === false &&
      beneficiary?.imageUrl != null
    );
  }

  showCaptureBiometric(beneficiary:  any): boolean {
    if (beneficiary?.registrationType === 'AGENT') {
      return (
        beneficiary?.formStage === 'OTHER_DETAILS' &&
        beneficiary?.fingerprintCaptured === false &&
        beneficiary?.biometricMatch === false
      );
    } else {
      return (
        beneficiary?.formStage === 'OTHER_DETAILS' &&
        beneficiary?.imageUrl == null
      );
    }
  }

  showSubmitOnboarding(beneficiary: any): boolean {
    if (beneficiary?.registrationType === 'AGENT') {
      return (
        beneficiary?.formStage === 'OTHER_DETAILS' &&
        beneficiary?.fingerprintCaptured === true &&
        beneficiary?.biometricMatch === true
      );
    } else {
      return (
        beneficiary?.formStage === 'OTHER_DETAILS' &&
        beneficiary?.biometricMatch === true
      );
    }
  }


    validateRequest(Beneficiary: any) {
    // this.beneficiaryService.setBeneficiaryProfile(Beneficiary);

 
    this.router.navigate(['/home/biometric-validation-request'], {
      queryParams: {
        data: Beneficiary?.nin,
      },
    });
  }

  
  navigateToBiometricRoute(beneficiary:  any) {
    localStorage.removeItem('NINDetails');
    localStorage.removeItem('beneficiaryPhoneNumber');
    localStorage.removeItem('biometrics');
    localStorage.removeItem('incomplete');
    localStorage.removeItem('verification');
    localStorage.removeItem('nin');
    localStorage.removeItem('faceCapture_skipThumPrints');
    localStorage.removeItem('isFingerprintOk');
    localStorage.removeItem('userAddress');


    this.beneficiaryService.cacheBeneficiaryPrefill(beneficiary);
    localStorage.setItem('userAddress', beneficiary?.address);
    localStorage.setItem(
      'incomplete',
      "Let's continue from where you've stopped!",
    );
    this.beneficiaryService.setRouteToDisplay('biometrics');
    localStorage.setItem('biometrics', 'biometrics');
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'setup_biometrics',
      },
    });
  }


    continueOnboarding(beneficiary:  any) {
    localStorage.removeItem('NINDetails');
    localStorage.removeItem('beneficiaryPhoneNumber');
    localStorage.removeItem('biometrics');
    localStorage.removeItem('incomplete');
    localStorage.removeItem('verification');
    localStorage.removeItem('nin');
    localStorage.removeItem('faceCapture_skipThumPrints');
    localStorage.removeItem('isFingerprintOk');
    localStorage.removeItem('userAddress');
    

    this.beneficiaryService.cacheBeneficiaryPrefill(beneficiary);
    localStorage.setItem('userAddress', beneficiary?.address);
    localStorage.setItem(
      'incomplete',
      "Let's continue from where you've stopped!",
    );
    if (beneficiary?.formStage === 'VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('verify beneficiary nin');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verify_NIN',
        },
      });
    } else if (beneficiary?.formStage === 'NIN_VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('personal details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'personal_details',
        },
      });
    } else if (beneficiary?.formStage === 'OTP_VERIFICATION') {
      this.beneficiaryService.setRouteToDisplay('biometrics');
      localStorage.setItem('biometrics', 'biometrics');
      this.router.navigate(['/home/setup-biometrics'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'setup_biometrics',
        },
      });
     
    } else if (beneficiary?.formStage === 'PERSONAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('verification procedure');
      localStorage.setItem('verification', 'verification');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'verification_procedure',
        },
      });
    } else if (
      beneficiary?.formStage === 'BIO_VERIFICATION' ||
      beneficiary?.formStage === 'VERIFIED'
    ) {
      this.beneficiaryService.setRouteToDisplay('residential details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'residential_details',
        },
      });
    } else if (beneficiary?.formStage === 'ADDRESS_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('marital info');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'marital_info',
        },
      });
    } else if (beneficiary?.formStage === 'MARITAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('education');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'education',
        },
      });
    } else if (beneficiary?.formStage === 'EDUCATION_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('health');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'health',
        },
      });
    } else if (beneficiary?.formStage === 'HEALTH_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('financial');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'financial',
        },
      });
    } else if (beneficiary?.formStage === 'FINANCIAL_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('next of kin');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'next_of_kin',
        },
      });
    } else if (beneficiary?.formStage === 'NEXT_OF_KIN') {
      this.beneficiaryService.setRouteToDisplay('employment');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'employment',
        },
      });
    } else if (beneficiary?.formStage === 'EMPLOYMENT_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('occupation');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'occupation',
        },
      });
    } else if (beneficiary?.formStage === 'OCCUPATION_DETAILS') {
      this.beneficiaryService.setRouteToDisplay('other details');
      this.router.navigate(['/home/beneficiary'], {
        relativeTo: this.route,
        queryParams: {
          progress: 'other_details',
        },
      });
    }
  }


   submitOnboarding(beneficiary:  any) {
    localStorage.removeItem('NINDetails');
    localStorage.removeItem('beneficiaryPhoneNumber');
    localStorage.removeItem('biometrics');
    localStorage.removeItem('incomplete');
    localStorage.removeItem('verification');
    localStorage.removeItem('nin');
    localStorage.removeItem('faceCapture_skipThumPrints');
    localStorage.removeItem('isFingerprintOk');
    localStorage.removeItem('userAddress');

    this.beneficiaryService.cacheBeneficiaryPrefill(beneficiary);
    localStorage.setItem('userAddress', beneficiary?.address);
    localStorage.setItem(
      'incomplete',
      "Let's continue from where you've stopped!",
    );
    this.beneficiaryService
      .onboardingSubmitted(beneficiary?.phoneNumber)
      ?.subscribe({
        next: (elem: any) => {
          // console.log('res>>', elem);
          this.router.navigate(['/home/dashboard'], {
            relativeTo: this.route,
          });
          this.toast.setSuccessMessage(
            "Beneficiary's onboarding has been completed successfully!",
          );
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
        },
        error: (err: any) => {
          console.error('err>>>', err);
          this.toast.setErrorMessage(
            err?.error?.failureReason ||
              err?.error?.responseMessage ||
              err?.statusText ||
              'Oops an error occured!',
          );
          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });
          if (err?.status === 401) {
            this.showSpinner = false;
            this.authService.agentLogout();
          }
        },
      });
  }


}
