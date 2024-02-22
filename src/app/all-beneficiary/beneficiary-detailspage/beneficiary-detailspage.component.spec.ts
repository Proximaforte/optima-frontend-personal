import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDetailspageComponent } from './beneficiary-detailspage.component';

describe('BeneficiaryDetailspageComponent', () => {
  let component: BeneficiaryDetailspageComponent;
  let fixture: ComponentFixture<BeneficiaryDetailspageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryDetailspageComponent]
    });
    fixture = TestBed.createComponent(BeneficiaryDetailspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
