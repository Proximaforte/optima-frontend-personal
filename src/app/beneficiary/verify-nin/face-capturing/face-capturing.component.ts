import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { WebcamComponent , WebcamInitError} from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-face-capturing',
  templateUrl: './face-capturing.component.html',
  styleUrls: ['./face-capturing.component.scss']
})
export class FaceCapturingComponent implements OnInit {

  routeBack: string = "/assets/images/back.svg";
  icon1: string =  "/assets/images/icon1.svg";
  icon2: string =  "/assets/images/icon2.svg";
  icon3: string =  "/assets/images/icon3.svg";
  icon4: string =  "/assets/images/icon4.svg";
  upload: string =  "/assets/images/iconplus.svg";
  passport: string = "/assets/images/passport.svg";
  disabledBtn: boolean = true;

  // webcam property: https://chat.openai.com/c/cb11f9f6-fa58-4a6c-b756-81a38ae881cd
  @ViewChild('webcam') webcam!: WebcamComponent | any;
  showWebcam: boolean = false;
  screenHeight: number = 0;
  screenWidth: number = 0;
  triggerObservable: Subject<void> = new Subject<void>();


// window browser getUserMedia property https://chat.openai.com/c/c402703b-b935-433f-a90a-9731375a972b
  @ViewChild('videoElement') videoElement!: ElementRef;
  cameraActive: boolean = false;
  stream: MediaStream | null | any = null;
  constructor(){}

  async toggleCamera() {
    // window browser getUserMedia property https://chat.openai.com/c/c402703b-b935-433f-a90a-9731375a972b
    if (!this.cameraActive) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = this.videoElement.nativeElement;
        if ('srcObject' in video) {
          video.srcObject = this.stream;
        } else {
          // For older browsers without srcObject support
          video.src = window.URL.createObjectURL(this.stream);
        }
        video.play();
        this.cameraActive = true;
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    } else {
      if (this.stream) {
        this.stream.getTracks().forEach((track: any) => track.stop());
        this.cameraActive = false;
      }
    }
  }




    // Method to capture snapshot
  toggleWebcam( options?: any | { imageFormat?: 'jpeg' | 'png', imageQuality?: number }) {
    this.showWebcam = !this.showWebcam;
    if (this.showWebcam) {
      this.startWebcam();
      this.triggerObservable.next(options);
    } else {
      this.stopWebcam();
    }
  }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

     // Add event listener to update dimensions when the window is resized
     window.addEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    console.log("my screen's height>>", this.screenHeight);
    console.log("my screen's width>>", this.screenWidth);
  }

  startWebcam() {
    this.webcam.start()
    .then((result: any) => {
      console.log('Webcam started');
    })
    .catch((error: WebcamInitError) => {
      console.error(error);
    });
  }

  stopWebcam() {
    this.webcam.stop();
    console.log('Webcam stopped');
  }

  // Set dimensions of the webcam based on screen size
  get webcamHeight(): number {
    return this.screenHeight;
  }

  get webcamWidth(): number {
    return this.screenWidth;
  }


  submit(){

  }
}
