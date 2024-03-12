import { Component, OnInit } from '@angular/core';
import { ToastsService } from 'src/app/services/alert/toasts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit{
  errorMessage: string = "";
  successMessage: string = "";
  showErrorMessage: boolean = false;
  showSucessMessage: boolean = false

  successSubscription$!: Subscription;
  errorSubscription$!: Subscription;
  constructor(
    private toast: ToastsService
  ){}

  ngOnInit(): void {
    this.getErrorMessage();
    this.getSuccessMessage();
  }

  getErrorMessage(){
    this.errorSubscription$ = this.toast.getErrorMessage().subscribe({
      next: (message:any) => {
        this.showErrorMessage = true;
        this.showSucessMessage = false;
        this.errorMessage = message;
      }
    });

  }

  getSuccessMessage(){
  this.successSubscription$ = this.toast.getSuccessMessage().subscribe({
    next: (message: any) => {
      this.showSucessMessage = true;
      this.showErrorMessage = false;
      this.successMessage = message;
    }
  })
  }

 
}
