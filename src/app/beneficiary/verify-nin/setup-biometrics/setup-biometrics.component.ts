import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SuccesfulBiometricsComponent } from 'src/app/utilities/modals/succesful-biometrics/succesful-biometrics.component';
import { MatDialog } from '@angular/material/dialog';

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
  marked:string = "/assets/images/marked.svg";
  disabledBtn: boolean = true;
  showOtp: boolean = false;
  urlPath: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ){
    const routePath = this.route.queryParams.subscribe({
      next: (urlPath: Params ) => {
       // console.log("urlPath>>>", urlPath?.['progress']);
        this.urlPath = urlPath?.['progress'];
        if(this.urlPath === 'finger_capture_done'){
          this.disabledBtn = false;
        }
      }
    })
  }

  procedureInterface(param: string, route: string){
    // this.showOtp = true;
    this.router.navigate([route],{
      relativeTo: this.route,
      queryParams: {
        progress: param,
      }
    });
  }

  proceed(){
    this.dialog.open(SuccesfulBiometricsComponent)
  }
}
