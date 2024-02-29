import { Component } from '@angular/core';
import { SuccessfulBeneficiaryOnboardingComponent } from 'src/app/utilities/modals/successful-beneficiary-onboarding/successful-beneficiary-onboarding.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent {
  options: string[] = ["If yes, for what offence?*", "Theft", "Assault", "Drug", "Drug-related Offenses", "Traffic violation", "Others"];
  option2:  string[] = ["what is your regular means of transportation?*", "Own car", "Public transport", "Okada", "Rail"];
  constructor(
    private dialog: MatDialog
  ){}

  succesfulOboarding(){
    this.dialog.open(SuccessfulBeneficiaryOnboardingComponent)
  }
}
