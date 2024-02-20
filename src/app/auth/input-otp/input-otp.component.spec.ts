import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOTPComponent } from './input-otp.component';

describe('InputOTPComponent', () => {
  let component: InputOTPComponent;
  let fixture: ComponentFixture<InputOTPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputOTPComponent]
    });
    fixture = TestBed.createComponent(InputOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
