import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {
  getAgentData(): string | null {
    return localStorage.getItem('user');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('Skip-Interceptor') === 'true') {
      return next.handle(req);
    }

    const token = this.getAgentData();
    const jwToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    });

    return next.handle(jwToken);
  }
}
