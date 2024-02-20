import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';


@Injectable({
  providedIn: 'root'
})

export class othersGuard implements CanActivate{
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      if(!this.authService.agentIsLoggedIn()){
        this.router.navigate(['/auth/login'],{relativeTo: this.route});
        console.info(route);
        console.info(state);
        return false
      }
    return true;
  }
};
