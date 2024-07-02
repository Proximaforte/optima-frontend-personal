import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { BeneficiaryProfile } from 'src/app/models/beneficiary/beneficiary';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';

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

  constructor(
    private beneficiaryService: BeneficiaryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private renderer: Renderer2,
    private el: ElementRef
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

  ngOnInit(): void {
    if (this.ssid === undefined) {
      this.getDummyData();
    } else {
      this.getBeneficiaryProfileData();
    }
  }
}
