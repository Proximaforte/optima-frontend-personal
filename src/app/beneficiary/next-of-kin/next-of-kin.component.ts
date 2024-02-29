import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.component.html',
  styleUrls: ['./next-of-kin.component.scss']
})
export class NextOfKinComponent {

  options:string[]=["State of residence"];
  option2:string[]=["Local government of residence"];
  financialInfoForm!: FormGroup ;
  constructor(){}
}
