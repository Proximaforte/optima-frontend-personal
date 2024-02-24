import { Component } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-capture-complete',
  templateUrl: './capture-complete.component.html',
  styleUrls: ['./capture-complete.component.scss']
})
export class CaptureCompleteComponent {

  disabledBtn: boolean = true;
  passport: string = "/assets/images/passport.svg";
  capture: string = "/assets/images/capture.svg";
  constructor(
    private service: BeneficiaryService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.passport = this.service.getImageUrl();
   // console.log("imageUrl>>>", this.service.getImageUrl());
  }

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
        progress: 'face_capturing'
      }
    })
  }


}
