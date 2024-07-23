import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StateService } from '../../../state.service';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { ToastsComponent } from 'src/app/utilities/toasts/toasts.component';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { SetupBiometricsComponent } from './setup-biometrics.component';

@Component({
  selector: 'app-fingerprint-consent',
  template: `
    <div [className]="'w-[25rem] p-5 py-5'">
      <div [className]="'pb-5'">
        <svg
          width="56"
          height="57"
          viewBox="0 0 56 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4.5" width="48" height="48" rx="24" fill="#FEF0C7" />
          <rect
            x="4"
            y="4.5"
            width="48"
            height="48"
            rx="24"
            stroke="#FFFAEB"
            stroke-width="8"
          />
          <path
            d="M27.9988 24.5012V28.5012M27.9988 32.5012H28.0088M26.2888 19.3612L17.8188 33.5012C17.6442 33.8036 17.5518 34.1465 17.5508 34.4957C17.5498 34.8449 17.6403 35.1883 17.8132 35.4917C17.9862 35.7951 18.2355 36.0479 18.5365 36.225C18.8375 36.4021 19.1796 36.4973 19.5288 36.5012H36.4688C36.818 36.4973 37.1601 36.4021 37.4611 36.225C37.7621 36.0479 38.0114 35.7951 38.1844 35.4917C38.3573 35.1883 38.4478 34.8449 38.4468 34.4957C38.4458 34.1465 38.3534 33.8036 38.1788 33.5012L29.7088 19.3612C29.5305 19.0673 29.2795 18.8243 28.98 18.6557C28.6805 18.487 28.3425 18.3984 27.9988 18.3984C27.6551 18.3984 27.3171 18.487 27.0176 18.6557C26.7181 18.8243 26.4671 19.0673 26.2888 19.3612Z"
            stroke="#BF6A02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <p
        [className]="'font-semibold  text-[#101828] text-[1.1rem] font-euclid'"
      >
        Why do you want to skip capturing?
      </p>
      <div class="row-span-1 mt-5">
        <form class="max-w-sm grid gap-5" (change)="onSelectionChange($event)">
          <div>
            <input
              [type]="'radio'"
              name="reasonForSkipping"
              [id]="'cutoff'"
              value="Fingers are cutoff"
              [className]="'checked:bg-[#109856] rounded-[4px]'"
            />
            <label
              for="cutoff"
              class="ml-5 font-euclid text-sm text-[#344054] cursor-pointer"
              >Beneficiary thumbs are cut-off</label
            >
          </div>
          <div>
            <input
              [type]="'radio'"
              name="reasonForSkipping"
              [id]="'burnt'"
              value="Fingers are burnt"
              [className]="'checked:bg-[#109856] rounded-[4px]'"
            />
            <label
              for="burnt"
              class="ml-5 font-euclid text-sm text-[#344054] cursor-pointer"
              >Thumbs are burnt</label
            >
          </div>
          <div>
            <input
              [type]="'radio'"
              name="reasonForSkipping"
              [id]="'injuries'"
              [id]="'injuries'"
              value="Fingers are injured"
              [className]="'checked:bg-[#109856] rounded-[4px]'"
            />
            <label
              for="injuries"
              class="ml-5 font-euclid text-sm text-[#344054] cursor-pointer"
              >Temporary injuries</label
            >
          </div>
          <div>
            <input
              [type]="'radio'"
              [id]="'other'"
              name="reasonForSkipping"
              value="Other disabilities"
              [className]="'checked:bg-[#109856] rounded-[4px]'"
            />
            <label
              for="other"
              class="ml-5 font-euclid text-sm text-[#344054] cursor-pointer"
              >Other disabilities</label
            >
          </div>
        </form>
      </div>
      <div mat-dialog-actions [className]="'mt-10'">
        <button
          mat-button
          [className]="
            'bg-[#109856] font-euclid w-full outline-none border-none p-3 text-white rounded-[4px]'
          "
          (click)="onClose()"
        >
          <span class="mr-2">Proceed to skip</span>
          <div role="status" class="ml-2" *ngIf="showSpinner">
          <span class="loader"></span>
          </div>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./setup-biometrics.component.scss'],
})
export class SkipFingerprintConsentModal {
  selectedReason: string | null = null;
  showSpinner: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SkipFingerprintConsentModal>,
    private dialog: MatDialogRef<SetupBiometricsComponent>,
    private beneficiaryService: BeneficiaryService,
    private snackbar: MatSnackBar,
    private toast: ToastsService,
    private auth: AuthService,
  ) {}

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedReason = target.value;
    }
  }

  onClose(): void {
    if (!this.selectedReason) {
      this.toast.setErrorMessage("Please select a reason to proceed.");
      this.snackbar.openFromComponent(ToastsComponent, {
        duration: 4000,
        verticalPosition: 'bottom',
      });
      return;
    }
    this.showSpinner = true;
    const getNin: any = localStorage.getItem('NINDetails');
    let newNin: any = JSON.parse(getNin);
    this.beneficiaryService.skipFingerPrint(newNin?.nin, this.selectedReason as string).subscribe({
      next: (res: any) => {
        // this.toast.setSuccessMessage('Fingerprint skipped successfully!');
        // this.snackbar.openFromComponent(ToastsComponent, {
        //   duration: 4000,
        //   verticalPosition: 'bottom',
        // });
        this.showSpinner = false;
        this.dialogRef.close(this.selectedReason);
        this.dialog.close(this.selectedReason)
      },
      error: (err: any) => {
        this.dialogRef.close(this.selectedReason);
        this.dialog.close(this.selectedReason)
        this.showSpinner = false;
        this.toast.setErrorMessage(
          err?.error?.responseMessage ??
            err?.statusText ??
            'Oops an error occured!',
        );
        this.snackbar.openFromComponent(ToastsComponent, {
          duration: 4000,
          verticalPosition: 'bottom',
          politeness: 'polite',
        });
        if (err?.status === 401) {
          this.auth.agentLogout();
        }
      },
    });
  }
}
