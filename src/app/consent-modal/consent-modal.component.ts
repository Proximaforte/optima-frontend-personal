
import { Location } from '@angular/common';  // Import Location
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, TemplateRef, ViewChild,EventEmitter, Output, } from '@angular/core';
import {  Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss']
})
export class ConsentModalComponent {

  @ViewChild('consentModal') consentModal!: TemplateRef<any>;


 

  @Input() showConsent: boolean = true;
  @Input() warn: string = '';
  @Input() back: string = '';
  @Input() privacy: string = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();


  routeArray: any = [
    {
      routeToDiaplay: 'verify beneficiary nin',
      queryParam: 'verify_NIN'
    },
    {
      routeToDiaplay: 'personal details',
      queryParam: 'personal_details'
    },
    {
      routeToDiaplay: 'residential details',
      queryParam: 'residential_details'
    },
    {
      routeToDiaplay: 'marital info',
      queryParam: 'marital_info'
    },
    {
      routeToDiaplay: 'education',
      queryParam: 'education'
    },
    {
      routeToDiaplay: 'health',
      queryParam: 'health'
    },
    {
      routeToDiaplay: 'financial',
      queryParam: 'financial'
    },
    {
      routeToDiaplay: 'next of kin',
      queryParam: 'next_of_kin'
    },
    {
      routeToDiaplay: 'employment',
      queryParam: 'employment'
    },
    {
      routeToDiaplay: 'other details',
      queryParam: 'other_details'
    },
  ]

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location  // Inject Location
  ) {}






  onCancel(): void {
    this.dialog.closeAll();
    this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
  }

  onAccept(): void {
    this.dialog.closeAll();
    this.router.navigate(['/home/beneficiary'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'verify_NIN'
      }
    });
  }

  toggleModalContent(): void {
    this.showConsent = !this.showConsent;
  }

  closePrivacyPolicy(): void {
    this.showConsent = true;
    this.dialog.closeAll();
  }

}
