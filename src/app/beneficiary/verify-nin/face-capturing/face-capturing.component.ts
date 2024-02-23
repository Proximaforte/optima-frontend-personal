import { Component } from '@angular/core';

@Component({
  selector: 'app-face-capturing',
  templateUrl: './face-capturing.component.html',
  styleUrls: ['./face-capturing.component.scss']
})
export class FaceCapturingComponent {

  routeBack: string = "/assets/images/back.svg";
  icon1: string =  "/assets/images/icon1.svg";
  icon2: string =  "/assets/images/icon2.svg";
  icon3: string =  "/assets/images/icon3.svg";
  icon4: string =  "/assets/images/icon4.svg";
  constructor(){}
}
