import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-setup-biometrics',
  templateUrl: './setup-biometrics.component.html',
  styleUrls: ['./setup-biometrics.component.scss']
})
export class SetupBiometricsComponent {

  poweredByOptima: string = "/assets/images/powered.svg";
  phone: string = "/assets/images/phone.svg";
  face: string = "/assets/images/face_capture.svg";
  finger:string = "/assets/images/fingerprints.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  procedureInterface(param: string, route: string){
    // this.showOtp = true;
    this.router.navigate([route],{
      relativeTo: this.route,
      queryParams: {
        progress: param,
      }
    });
  }
}
