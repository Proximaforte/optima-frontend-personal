import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddStyleToOtpInputDirective } from './directives/add-style-to-otp-input.directive';
import { JwtInterceptorService } from './services/authentication/interceptor/jwt-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    AddStyleToOtpInputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule

  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
