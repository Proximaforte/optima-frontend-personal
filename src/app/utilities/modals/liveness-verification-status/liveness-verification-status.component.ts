import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type LivenessVerificationStatus = 'loading' | 'success' | 'error';
export type LivenessVerificationStatusAction =
  | 'continue'
  | 'retry'
  | 'cancel';

export interface LivenessVerificationStatusData {
  status: LivenessVerificationStatus;
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-liveness-verification-status',
  templateUrl: './liveness-verification-status.component.html',
  styleUrls: ['./liveness-verification-status.component.scss'],
})
export class LivenessVerificationStatusComponent {
  status: LivenessVerificationStatus;
  title?: string;
  message?: string;

  readonly logo = '/assets/images/Optima_.svg';

  constructor(
    private dialogRef: MatDialogRef<
      LivenessVerificationStatusComponent,
      LivenessVerificationStatusAction
    >,
    @Inject(MAT_DIALOG_DATA) data: LivenessVerificationStatusData,
  ) {
    this.status = data.status;
    this.title = data.title;
    this.message = data.message;
  }

  get isLoading(): boolean {
    return this.status === 'loading';
  }

  get isSuccess(): boolean {
    return this.status === 'success';
  }

  get displayTitle(): string {
    if (this.title) {
      return this.title;
    }

    if (this.status === 'success') {
      return 'Verification Successful';
    }

    if (this.status === 'error') {
      return 'Verification Failed';
    }

    return 'Waiting for Verification';
  }

  get displayMessage(): string {
    return (
      this.message ||
      'Please wait while we confirm your liveness verification.'
    );
  }

  updateState(data: LivenessVerificationStatusData): void {
    this.status = data.status;
    this.title = data.title;
    this.message = data.message;
  }

  continue(): void {
    this.dialogRef.close('continue');
  }

  retry(): void {
    this.dialogRef.close('retry');
  }

  submitPrimaryAction(): void {
    if (this.isSuccess) {
      this.continue();
      return;
    }

    this.retry();
  }

  cancel(): void {
    this.dialogRef.close('cancel');
  }
}
