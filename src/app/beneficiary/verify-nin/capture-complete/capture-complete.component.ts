import { Component, Inject } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-capture-complete',
  templateUrl: './capture-complete.component.html',
  styleUrls: ['./capture-complete.component.scss']
})
export class CaptureCompleteComponent {

  disabledBtn: boolean = true;
  passport: string = "/assets/images/passport.svg";
  capture: string = "/assets/images/capture.svg";
  paramData: any = {};
 // matData!: MAT_DIALOG_DATA
  constructor(
    private service: BeneficiaryService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.passport = this.service.getImageUrl();
    this.paramData = JSON.parse(this.data);
  }

  // this.router.navigate(['/home/setup-biometrics'], {
  //   relativeTo: this.route,
  //   queryParams: {
  //     progress: 'finger_capture_done'
  //   }
  // })

  retakePicture(){
    this.service.returnImageUrl({
      image: '/assets/images/passport.svg',
      showLatest: false
    });
   // this.service.setShowOriginal(false);
  }

  proceed(){
    this.service.returnImageUrl({
      image: this.passport,
      showLatest: true
    });
    // this.service.setShowOriginal(true);
    this.router.navigate(['/home/face-capturing'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'face_capturing',
        data: this.paramData?.nin
      }
    })
  }


}
