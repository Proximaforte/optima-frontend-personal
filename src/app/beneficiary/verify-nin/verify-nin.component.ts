import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-nin',
  templateUrl: './verify-nin.component.html',
  styleUrls: ['./verify-nin.component.scss']
})
export class VerifyNINComponent implements OnInit {

  ninPlaceHolder: string = '';
  ninForm!: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

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
      nin: new FormControl('', [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(11)])
    })
  }

  submit(){
    // console.log("values>>>", this.ninForm.value);
    this.router.navigate(["/home/verification-code"],{relativeTo: this.route, queryParams:{progress: "enter_verification_code"}});
  }

}
