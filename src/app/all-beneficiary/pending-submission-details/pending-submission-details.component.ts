import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeneficiaryService } from '../../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-pending-submission-details',
  templateUrl: './pending-submission-details.component.html',
})
export class PendingSubmissionDetailsComponent implements OnInit {
  submission: any;
  loading = false;
  error = false;
  reference = '';

  constructor(
    private route: ActivatedRoute,
    private beneficiaryService: BeneficiaryService,
  ) {}

  ngOnInit(): void {
    this.reference = this.route.snapshot.paramMap.get('reference') ?? '';
    this.loadDetails();
  }

  loadDetails(): void {
    if (!this.reference) {
      this.error = true;
      return;
    }

    this.loading = true;
    this.error = false;

    this.beneficiaryService.getPendingSubmissionDetails(this.reference).subscribe({
      next: (response: any) => {
        this.submission = response?.data ?? response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  fullName(): string {
    const firstName = this.submission?.firstName ?? '';
    const middleName = this.submission?.middleName ?? '';
    const lastName = this.submission?.lastName ?? '';
    return [firstName, middleName, lastName].filter(Boolean).join(' ') || 'N/A';
  }

  statusLabel(status: string): string {
    return (status || 'PENDING')
      .toLowerCase()
      .split('_')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ');
  }
}
