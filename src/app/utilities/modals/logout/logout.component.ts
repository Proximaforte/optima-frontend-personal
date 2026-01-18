import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastsComponent } from '../../toasts/toasts.component';
import { ToastsService } from 'src/app/services/alert/toasts.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private toast: ToastsService
  ){}

  logoutUser(){
      this.authService.logoutUser().subscribe({
        next: (res: any) => {
          //  console.log("logout res>>>", res)
          this.toast.setSuccessMessage('User is logged Out Successfully');

          localStorage.clear();



          this.snackbar.openFromComponent(ToastsComponent, {
            duration: 4000,
            verticalPosition: 'bottom',
          });

        },
        error: (err: any) => {
          console.error("logout error>>>", err);
        }
      })
      this.authService.agentLogout();
      
  }
}
