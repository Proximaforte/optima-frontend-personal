import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  HttpClientModule } from '@angular/common/http';
import { AddStyleToOtpInputDirective } from './directives/add-style-to-otp-input.directive';


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
  bootstrap: [AppComponent]
})
export class AppModule { }
