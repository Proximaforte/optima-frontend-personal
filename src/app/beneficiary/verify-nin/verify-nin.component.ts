import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verify-nin',
  templateUrl: './verify-nin.component.html',
  styleUrls: ['./verify-nin.component.scss']
})
export class VerifyNINComponent implements OnInit {

  ninPlaceHolder: string = '';
  ninForm!: FormGroup;
  constructor(){}

  detectClicked(){
    this.ninPlaceHolder = 'Input National Identity Number';
  }
  onInputBlur() {
    this.ninPlaceHolder = '';
  }

  ngOnInit(): void {
    this.getFormValues();
  }

  getFormValues(){
    this.ninForm = new FormGroup({
      nin: new FormControl('', [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(11), Validators.maxLength(11)])
    })
  }

  submit(){
    console.log("values>>>", this.ninForm.value);
  }

}
