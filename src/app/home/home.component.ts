import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  ngAfterViewChecked() {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;

}
}
