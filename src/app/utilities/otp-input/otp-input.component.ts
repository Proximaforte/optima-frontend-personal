import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent {

  @Output() otpChange: EventEmitter<any> = new EventEmitter<string>();
  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;

  otp: string = '';
  constructor(){}

  onKeyUp(event: any, index: number) {
    const target = event.target;
    const length = target.value.length;
    if (length === 1) {
      if (index === 1) this.input2.nativeElement.focus();
      if (index === 2) this.input3.nativeElement.focus();
      if (index === 3) this.input4.nativeElement.focus();
    }
    if (length === 0 && index > 0) {
      if (index === 4) this.input3.nativeElement.focus();
      if (index === 3) this.input2.nativeElement.focus();
      if (index === 2) this.input1.nativeElement.focus();
    }
    this.updateOtp();
  }

  
  updateOtp() {
    const otp = this.input1.nativeElement.value +
                this.input2.nativeElement.value +
                this.input3.nativeElement.value +
                this.input4.nativeElement.value;
    this.otpChange.emit(otp);
  }

}
