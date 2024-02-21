import { Component } from '@angular/core';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent {

  beneficiaryItems: String[] | any = [
    "verify beneficiary nin",
    "personal details",
    "residential details",
    "marital info",
    "education",
    "health",
    "financial",
    "next of kin",
    "employment",
    "other details"
  ]
  selectedItemIndex: number | null = null;
constructor(){
}

isSelectedIndex(index: number): boolean {
  return this.selectedItemIndex === index;
}



itemClicked(index: number) {
  this.selectedItemIndex = index;
}




}
