import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-succesful-passwords',
  templateUrl: './succesful-passwords.component.html',
  styleUrls: ['./succesful-passwords.component.scss']
})
export class SuccesfulPasswordsComponent {
  successMark: string = "/assets/images/mark.svg";
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  submit(){
    this.router.navigate(["/auth/login"],{
      relativeTo: this.route,
      queryParams: {
        route: "user-login"
      }
    
    })
  }
}
