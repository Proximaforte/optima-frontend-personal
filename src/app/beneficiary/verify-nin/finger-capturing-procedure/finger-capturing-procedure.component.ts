import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finger-capturing-procedure',
  templateUrl: './finger-capturing-procedure.component.html',
  styleUrls: ['./finger-capturing-procedure.component.scss']
})
export class FingerCapturingProcedureComponent {

  bullet: string =  "/assets/images/bullet.svg";
  done: string =  "/assets/images/done.svg";
  active: string =  "/assets/images/active.svg";
  inactive: string =  "/assets/images/inactive.svg";
  err: string =  "/assets/images/err.svg";
  leftThumb: string =  "/assets/images/left_hand.svg";
  scan: string =  "/assets/images/scan.svg";
  blurr: string =  "/assets/images/blurr.svg";
  click: string =  "/assets/images/click.svg";
  active_: string =  "/assets/images/vuesax.svg";
  inactive_: string =  "/assets/images/vuesax-done.svg";
  left_thumb: string =  "/assets/images/left_thumb.svg";
  previous: string =  "/assets/images/previous.svg";
  next: string =  "/assets/images/next.svg";
  activeText: string =  "/assets/images/active-text.svg";
  right: string =  "/assets/images/wright.svg";
  rightThumb: string =  "/assets/images/right-thumb.svg"; 
  inactiveText: string =  "/assets/images/Inactive_text.svg";

  showOtherProcedure:boolean = false;
  constructor(
    private router:Router,
    private route: ActivatedRoute
  ){}

  toggleNext(){
    this.showOtherProcedure = true;
  }

  togglePrevious(){
    this.showOtherProcedure = false;
  }

  routeToPage(){
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'finger_capture_done'
      }
    })
  }


  // https://chat.openai.com/c/7ba50bd9-6bdd-4ce2-a5aa-3e415fc3eed4
}
