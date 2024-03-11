import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAddStyleToOtpInput]'
})
export class AddStyleToOtpInputDirective implements OnInit {

  @Input('appAddStyleToOtpInput') customStyles: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.customStyles) {
      const otpInput = this.elementRef.nativeElement;
      const inputBoxes = otpInput.querySelectorAll('input');
      inputBoxes.forEach((input: any) => {
        Object.keys(this.customStyles).forEach(style => {
          this.renderer.setStyle(input, style, this.customStyles[style]);
        });
      });
    }
  }

}
