import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentDetailsComponent } from './resident-details.component';

describe('ResidentDetailsComponent', () => {
  let component: ResidentDetailsComponent;
  let fixture: ComponentFixture<ResidentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidentDetailsComponent]
    });
    fixture = TestBed.createComponent(ResidentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
