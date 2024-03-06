import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  public setAgentLoginDetails({email, password}:any): Observable<any>{
    if(email !== null && password !== null){
      return of(
        {
          name: `${email?.split("@")[0]}`,
          email: email,
          description: "user is logged in successfully!"
        }
      )
    }
    return throwError(new Error('Failed to Login'));
  }

 public setAgentToken(user: any){
    localStorage.setItem('user', JSON.stringify(user));
  }

 public getAgentData(): string | null {
    return localStorage.getItem('user');
  }

 public agentIsLoggedIn(){
    return this.getAgentData() !== null;
  }

 public agentLogout():void{
    localStorage.clear();
    this.router.navigate(['/auth/login'], {relativeTo: this.route});
  }


//   Super Admin Log in Details:
// Username: supersystemuser@optima.com
// Password: password

}
