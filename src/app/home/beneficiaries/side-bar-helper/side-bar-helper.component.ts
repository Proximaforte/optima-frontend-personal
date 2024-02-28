import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar-helper',
  templateUrl: './side-bar-helper.component.html',
  styleUrls: ['./side-bar-helper.component.scss']
})
export class SideBarHelperComponent {

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
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  isSelectedIndex(index: number): boolean {
    return this.selectedItemIndex === index;
  }

  itemClicked(index: number) {
    this.selectedItemIndex = index;
  }
}
