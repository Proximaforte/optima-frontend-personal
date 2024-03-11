import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient, HttpResponse } from '@angular/common/http';
import { JwtInterceptorService } from './interceptor/jwt-interceptor.service';
import { AgentCredentials, forgotPasswords } from 'src/app/models/login/auth';
import { environment } from 'src/app/environments/environment.prod';
import { endpoints } from 'src/app/models/APIs/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  agentCredentials!: AgentCredentials;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private interceptor: JwtInterceptorService
  ) {}

  public loginAgendData(user: AgentCredentials): Observable<any> {
    const body = JSON.stringify(user);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.login}`, body, { headers: this.interceptor?.customHttpHeaders}).pipe(
      map((res: HttpResponse<any>) => {
        console.log('Login response>>', res);
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('error from login observable>>', err);
        return throwError(() => err);
      }));
  }

  public forgotPasswords(path: forgotPasswords): Observable<any>{
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.forgetPassword}/${path.identifier}`, { headers: this.interceptor?.customNoAuthHttpHeaders});
  }

  

  public setAgentLoginDetails({ email, password }: any): Observable<any> {
    if (email !== null && password !== null) {
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

  public setAgentToken(user: any) {
    // localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', user);
  }

  public getAgentData(): string | null {
    return localStorage.getItem('user');
  }

  public agentIsLoggedIn() {
    return this.getAgentData() !== null;
  }

  public agentLogout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }


  //   Super Admin Log in Details:
  // Username: supersystemuser@optima.com
  // Password: password

}
