import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricValidationRequestComponent } from './biometric-validation-request.component';

describe('BiometricValidationRequestComponent', () => {
  let component: BiometricValidationRequestComponent;
  let fixture: ComponentFixture<BiometricValidationRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricValidationRequestComponent]
    });
    fixture = TestBed.createComponent(BiometricValidationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
