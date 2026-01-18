import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureBiometricComponent } from './capture-biometric.component';

describe('CaptureBiometricComponent', () => {
  let component: CaptureBiometricComponent;
  let fixture: ComponentFixture<CaptureBiometricComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureBiometricComponent]
    });
    fixture = TestBed.createComponent(CaptureBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
