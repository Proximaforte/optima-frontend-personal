import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor{

  constructor(private auth: AuthService) {
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
        Authorization: `Bearer ${token ? token : this.auth.token}`
      }
    })
    return next.handle(jwToken);
  }

  public customNoAuthHttpHeaders:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*',
       // 'method': 'POST',
    // 'no-auth': 'true',
    // 'Skip-Interceptor': 'true',
    // 'Referrer-Policy': 'strict-origin-when-cross-origin'
  })


  public customHttpHeaders:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*',
    'Authorization': `Bearer ${this.getAgentData() ? this.getAgentData() : this.auth.token}`
  })

  public customHttpHeadersNoBearer:any = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*',
    'Authorization': `${this.getAgentData() ? this.getAgentData() : this.auth.token}`
  })

  public customFormDataHttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'accept': '*/*',
    'Authorization': `Bearer ${this.getAgentData() ? this.getAgentData() : this.auth.token}`
  })
  



}
