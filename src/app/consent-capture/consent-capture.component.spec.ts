import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentCaptureComponent } from './consent-capture.component';

describe('ConsentCaptureComponent', () => {
  let component: ConsentCaptureComponent;
  let fixture: ComponentFixture<ConsentCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentCaptureComponent]
    });
    fixture = TestBed.createComponent(ConsentCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
