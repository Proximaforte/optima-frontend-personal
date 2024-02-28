import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalInfoComponent } from './marital-info.component';

describe('MaritalInfoComponent', () => {
  let component: MaritalInfoComponent;
  let fixture: ComponentFixture<MaritalInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaritalInfoComponent]
    });
    fixture = TestBed.createComponent(MaritalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
