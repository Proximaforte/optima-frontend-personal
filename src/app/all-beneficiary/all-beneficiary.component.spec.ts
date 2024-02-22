import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBeneficiaryComponent } from './all-beneficiary.component';

describe('AllBeneficiaryComponent', () => {
  let component: AllBeneficiaryComponent;
  let fixture: ComponentFixture<AllBeneficiaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllBeneficiaryComponent]
    });
    fixture = TestBed.createComponent(AllBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
