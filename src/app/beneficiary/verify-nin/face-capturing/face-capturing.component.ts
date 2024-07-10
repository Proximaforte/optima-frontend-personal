import { Component, OnInit, HostListener } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CaptureCompleteComponent } from '../capture-complete/capture-complete.component';
import { BeneficiaryService } from 'src/app/services/beneficiary/beneficiary.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-face-capturing',
  templateUrl: './face-capturing.component.html',
  styleUrls: ['./face-capturing.component.scss']
})
export class FaceCapturingComponent implements OnInit {

  routeBack: string = "/assets/images/back.svg";
  icon1: string = "/assets/images/icon1.svg";
  icon2: string = "/assets/images/icon2.svg";
  icon3: string = "/assets/images/icon3.svg";
  icon4: string = "/assets/images/icon4.svg";
  upload: string = "/assets/images/iconplus.svg";
  passport: string = "/assets/images/passport.svg";
  photograph: string = "";
  capture: string = "/assets/images/capture.svg";
  disabledBtn: boolean = true;
  acceptImage$!: Subscription;
  webcam: WebcamImage | any = null;
  showWebcam: boolean = false;
  capturedImage: string | any = null;
  trigger: Subject<void> = new Subject<void>();
  triggerObservable: Observable<void> = this.trigger.asObservable();
  webcamHeight: number = 0;
  webcamWidth: number = 0;
  showLatest: boolean = false;
  nin: any = {};
  userDetails: any = {};
  isDesktop: boolean = window.innerWidth >= 1024;

  constructor(
    private dialog: MatDialog,
    private service: BeneficiaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.webcamHeight = window?.innerHeight;
    this.webcamWidth = window?.innerWidth;

    const getUserData: any = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(getUserData);

    if (localStorage.getItem('NINDetails') !== null) {
      const getNin: any = localStorage.getItem('NINDetails');
      this.nin = JSON.parse(getNin);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = event.target.innerWidth >= 1024;
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
    this.dialog.open(CaptureCompleteComponent, {
      width: `${window.innerWidth}px`,
    });
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
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
    });
  }

  retake() {
    this.showLatest = false;
    this.disabledBtn = true;
  }

  submit() {
    const getBeneficiaryPhoneNumber: any = localStorage.getItem('beneficiaryPhoneNumber');
    const payload = {
      nin: this.nin?.nin,
      type: 'FACIAL_ID',
      phoneNumber: getBeneficiaryPhoneNumber,
      image: this.photograph?.split(',')[1]
    };
    localStorage.setItem('face_capture', JSON.stringify(payload));
    localStorage.setItem('face_capture', JSON.stringify(payload));
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'face_capture_done',
      }
    });
  }
}
