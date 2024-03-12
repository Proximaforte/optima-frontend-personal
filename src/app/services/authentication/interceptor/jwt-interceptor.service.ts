import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor() {
    this.getAgentData();
  }

  getAgentData(): string | null {
    return localStorage.getItem('user');
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('req>>>', req.headers);
    if (req.headers.get('Skip-Interceptor') === 'true') {
      return next.handle(req);
    }
    let token:any = this.getAgentData();
    let jwToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(jwToken);
  }

  public customNoAuthHttpHeaders:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'method': 'POST'
    // 'accept': '*/*',
    // 'no-auth': 'true',
    // 'Skip-Interceptor': 'true',
    // 'Referrer-Policy': 'strict-origin-when-cross-origin'
  })


  public customHttpHeaders:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*',
    'Authorization': `Bearer ${this.getAgentData()}`
  })

  public customFormDataHttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'accept': '*/*',
    'Authorization': `Bearer ${this.getAgentData()}`
  })
  



}
