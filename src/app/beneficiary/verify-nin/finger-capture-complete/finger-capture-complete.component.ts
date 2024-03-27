import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finger-capture-complete',
  templateUrl: './finger-capture-complete.component.html',
  styleUrls: ['./finger-capture-complete.component.scss']
})
export class FingerCaptureCompleteComponent implements OnInit{

  
  disabledBtn: boolean = true;
  passport: string = "/assets/images/passport.svg";
  capture: string = "/assets/images/capture.svg";
  nin: any = {};
  userDetails: any = {};

  constructor(
    private service: BeneficiaryService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.passport = this.service.getImageUrl();
   // console.log("imageUrl>>>", this.service.getImageUrl());
   const getUserData:any = localStorage.getItem('userDetails');
   this.userDetails = JSON.parse(getUserData);

   const getNin:any = sessionStorage.getItem('nin');
   this.nin = JSON.parse(getNin);

  }

  // this.router.navigate(['/home/setup-biometrics'], {
  //   relativeTo: this.route,
  //   queryParams: {
  //     progress: 'finger_capture_done'
  //   }
  // })

  ngOnInit(): void {
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
    const getBeneficiaryPhoneNumber:any = sessionStorage.getItem('beneficiaryPhoneNumber');
    const payload = {
      nin: this.nin?.nin,
      type: 'FACIAL_ID', //PHONE_NUMBER
      phoneNumber: getBeneficiaryPhoneNumber,
      image: this.passport?.split(',')[1]
    }
  //  console.log("payload>>", payload);
    sessionStorage.setItem('faceCapture_skipThumbPrints', JSON.stringify(payload));
    
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'finger_capture_done'
      }
    }).then(() => location.reload());

    // this.service.setShowOriginal(true);
    // this.router.navigate(['/home/setup-biometrics'], {
    //    relativeTo: this.route,
    //   queryParams: {
    //     progress: 'finger_capture_done'
    //   }
    // });
    //this.ngOnInit();
  }


}
