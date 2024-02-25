import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-skip-capturing',
  templateUrl: './skip-capturing.component.html',
  styleUrls: ['./skip-capturing.component.scss']
})
export class SkipCapturingComponent {

  successMark: string = "/assets/images/mark.svg";
  reasons: String[] = [
    'Beneficiary thumbs are cut-off',
    'Thumbs are burnt',
    'Temporary injury',
    'Other disabilities'
  ]
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  proceed(){
    this.router.navigate(['/home/setup-biometrics'], {
      relativeTo: this.route,
      queryParams: {
        progress: 'finger_capture_done'
      }
    })
  }
}
