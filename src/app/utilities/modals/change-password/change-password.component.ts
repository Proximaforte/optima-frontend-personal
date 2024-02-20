import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

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
