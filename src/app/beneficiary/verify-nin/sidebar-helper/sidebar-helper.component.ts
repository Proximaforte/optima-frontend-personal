import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar-helper',
  templateUrl: './sidebar-helper.component.html',
  styleUrls: ['./sidebar-helper.component.scss']
})
export class SidebarHelperComponent {

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
  isLinear = false;
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
