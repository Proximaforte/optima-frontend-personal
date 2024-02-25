import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SkipCapturingComponent } from 'src/app/utilities/modals/skip-capturing/skip-capturing.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-finger-capturing',
  templateUrl: './finger-capturing.component.html',
  styleUrls: ['./finger-capturing.component.scss']
})
export class FingerCapturingComponent {

  routeBack: string = "/assets/images/back.svg";
  bullet: string =  "/assets/images/bullet.svg";
  fingerprint: string =  "/assets/images/fingerprint.svg";
  marked:string = "/assets/images/marked.svg";
  skip:string = "/assets/images/skip.svg";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ){

  }

  routeToPrevious(){
    window.history.go(-1);
  }

  routeToNext(){
    this.router.navigate(['/home/finger-capturing-procedure'],{
      relativeTo: this.route,
      queryParams: {
        progress: "finger_capturing_procedure"
      }
    });
  }

  skipCapturing(){
    this.dialog.open(SkipCapturingComponent, {
      width: '500px'
    });
  }
}
