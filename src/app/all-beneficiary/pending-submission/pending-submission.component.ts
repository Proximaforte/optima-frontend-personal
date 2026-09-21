import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeneficiaryService } from '../../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-pending-submission',
  templateUrl: './pending-submission.component.html',
})
export class PendingSubmissionComponent implements OnInit {
  pendingSubmissions: any[] = [];
  loading = false;
  error = false;

  constructor(private beneficiaryService: BeneficiaryService, private router: Router) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.error = false;
    this.beneficiaryService.getPendingSubmissions().subscribe({
      next: (response: any) => {
        this.pendingSubmissions = Array.isArray(response)
          ? response
          : response?.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  statusLabel(status: string): string {
    return (status || 'PENDING')
      .toLowerCase()
      .split('_')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ');
  }

  view(submission: any): void {
    this.router.navigate(['/home/pending-submission', submission?.reference]);
  }
}
