import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';


@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      
      if (!this.authService.agentIsLoggedIn()){
        this.router.navigate(['/auth/login'],{relativeTo: this.route});
        this.authService.agentLogout();
        return false
      }
      // console.info("params>>", route, state);
      return this.authService.agentIsLoggedIn();
  }
}
