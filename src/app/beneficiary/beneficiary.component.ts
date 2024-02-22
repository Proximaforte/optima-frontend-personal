import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  selectedItemName: string | null = null;

constructor(
  private router: Router,
  private route: ActivatedRoute
){
  if(this.selectedItemName === null){
    this.selectedItemName = 'verify beneficiary nin';
  }
}

isSelectedIndex(index: number): boolean {
  return this.selectedItemIndex === index;
}



itemClicked(index: number , selectedItemName:string) {
  this.selectedItemIndex = index;
 if(index + 1 === 1){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "verify_NIN"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 2){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "personal_details"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 3){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "residential_details"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 4){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "marital_info"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 5){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "education"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 6){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "health"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 7){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "financial"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 8){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "next_of_kin"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 9){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "employment"}});
  this.selectedItemName = selectedItemName;
 }else if(index + 1 === 10){
  this.router.navigate([window?.location?.pathname],{relativeTo: this.route, queryParams: {progress: "other_details"}});
  this.selectedItemName = selectedItemName;
 }
}




}
