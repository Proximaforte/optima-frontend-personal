import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Subscription } from 'rxjs';
import { FingerCaptureCompleteComponent } from 'src/app/beneficiary/verify-nin/finger-capture-complete/finger-capture-complete.component';

@Component({
  selector: 'app-skip-capturing',
  templateUrl: './skip-capturing.component.html',
  styleUrls: ['./skip-capturing.component.scss']
})
export class SkipCapturingComponent implements OnInit {

  successMark: string = "/assets/images/mark.svg";
  reasons: String[] = [
    'Beneficiary thumbs are cut-off',
    'Thumbs are burnt',
    'Temporary injury',
    'Other disabilities'
  ]

  disabledBtn: boolean = true;
  acceptImage$!: Subscription;

  // @ViewChild('webcam') webcam!: WebcamComponent | any;
  webcam: WebcamImage | any = null;
  showWebcam: boolean = false;
  capturedImage: string | any = null;
  trigger: Subject<void> = new Subject<void>();
  triggerObservable: Observable<void> = this.trigger.asObservable();
  webcamHeight: number = 0;
  webcamWidth: number = 0;
  showLatest: boolean = false; //original === true
  photograph: string = "";
  showCloseBtn: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private service: BeneficiaryService,
  ) {
    this.webcamHeight = window?.innerHeight;
    this.webcamWidth = window?.innerWidth;
  }


  closeModal(){
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'finger_capture_done'
      }
    })
  }


  routeToPrevious() {
    window.history.go(-1);
  }


  handleImageCapture(webcamImage: WebcamImage) {
    this.webcam = webcamImage;
  }

  captureImage() {
    this.trigger.next();
    this.service.setImageUrl(this.webcam.imageAsDataUrl);
    this.dialog.open(FingerCaptureCompleteComponent, {
      width: `${window.innerWidth}px`
    });
    this.showWebcam = false;
  }

  public async toggleWebcam(): Promise<any> {
  //  this.showWebcam = !this.showWebcam;
  this.showWebcam = true;
  }

  ngOnInit(): void {
    this.showLatest = this.service.getShowOriginal();
    const acceptImage$ = this.service.acceptImageUrl().subscribe({
      next: (item: any) => {
        this.photograph = item?.image;
        this.showLatest = item?.showLatest;
        if (this.showLatest === true) {
          this.disabledBtn = false;
        }
      }
    })
  }

  retake() {
    this.showLatest = false;
    this.disabledBtn = true;
  }

}
