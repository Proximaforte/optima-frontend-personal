import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient, HttpResponse } from '@angular/common/http';
import { JwtInterceptorService } from './interceptor/jwt-interceptor.service';
import { AgentCredentials, changePassword, forgotPasswords, resetAgentPassword } from 'src/app/models/login/auth';
import { environment } from 'src/app/environments/environment.prod';
import { endpoints } from 'src/app/models/APIs/endpoints';
import { HealthDetails } from 'src/app/models/beneficiary/beneficiary';


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
  ) {
   if(this.getAgentData() !== null){
    this.getRefreshToken();
   }
  }

  // public loginAgendData(user: AgentCredentials): Observable<any> {
  //   const body = JSON.stringify(user);
  //   return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.login}`, body, { headers: this.interceptor?.customNoAuthHttpHeaders}).pipe(
  //     map((res: any) => {
  //       //console.log('Login response>>', res);
  //       return res;
  //     }),
  //     catchError((err: any) => {
  //       console.error('error from login observable>>', err);
  //       return throwError(() => err);
  //     }));
  // }

  async login(email: string, password: string): Promise<any> {
    try {
        const response = await this.http.post<any>(`${environment?.baseUrl}/${endpoints?.login}`, { email, password }).toPromise();
        return response; 
    } catch (error) {
        throw error; 
    }
}

 public getRefreshToken(){
    const accessToken = this.getAgentData();
    const splitToken:any = accessToken?.split('.')[1];
    const decodeToken = JSON.parse(atob(splitToken));  //decode the Token Body
    const expirationTime = decodeToken?.exp * 1000;
    const currentTime = new Date().getTime();
    const timeDifference = expirationTime - currentTime;
   // console.log('time difference>>', timeDifference);
    if(timeDifference === 10){  //once time diffrence equals 10secs, the refresh token is called
     this.refreshToken();
    }
  }

  public refreshToken():Observable<any>{
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.refreshToken}`, { headers: this.interceptor?.customHttpHeaders}).pipe(
      map((res:any) => {
      //  console.log('refresh token response>>>', res);
        if(res?.responseCode === 200){
          this.setAgentToken(res?.data);
        }
        return res;
      }),
      catchError((err:any) => {
        console.error('err from refresh token observable>>', err);
       return throwError(() => err)
      })
    )
  }

  public forgotPasswords(path: forgotPasswords): Observable<any>{
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.forgetPassword}/${path.identifier}`, { headers: this.interceptor?.customNoAuthHttpHeaders});
  }

  public validateOTP(path: forgotPasswords | any): Observable<any>{
   // const params = new HttpParams().set('token', path?.token).set('identifier', path?.identifier);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.validateForgetPasswordToken}?token=${path.token}&identifier=${path.identifier}`, { headers: this.interceptor?.customNoAuthHttpHeaders});
  }

  public changePasswords(path: changePassword): Observable<any>{
    const body = JSON.stringify(path);
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.changePassword}`, body , { headers: this.interceptor?.customHttpHeaders});
  }

  public resetPassword(param: resetAgentPassword): Observable<any>{
    const body = JSON.stringify(param)
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.resetPassword}`,body , { headers: this.interceptor?.customNoAuthHttpHeaders});
  }

  public getUserDetails():Observable<any>{
    return this.http.get<any>(`${environment?.baseUrl}/${endpoints?.getUserDetails}`, { headers: this.interceptor?.customHttpHeaders}).pipe(
      map((res:any) => {
       // console.log('user details response>>', res);
        localStorage.setItem('userDetails', JSON.stringify(res?.data));
        return res;
      }),
      catchError((err:any) => {
        return throwError(() => err);
      })
    )
  }

  public logoutUser():Observable<any>{
    return this.http.post<any>(`${environment?.baseUrl}/${endpoints?.logoutUser}`, {},{ headers: this.interceptor?.customHttpHeaders});
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
    return throwError(() => 'Failed to Login'); //throwError(new Error('Failed to Login'));
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
    sessionStorage.clear();
    console.clear();
    this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }

}


//https://chat.openai.com/c/31cf2fe8-7291-46f2-8c6b-99339276419f for users current location