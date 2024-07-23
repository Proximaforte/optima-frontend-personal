import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private renderer: Renderer2) {}
  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.renderer.setProperty(document.body, 'scrollTop', 0);
    window.scrollY = 0;
  }
}
