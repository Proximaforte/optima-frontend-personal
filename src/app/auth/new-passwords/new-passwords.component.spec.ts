import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordsComponent } from './new-passwords.component';

describe('NewPasswordsComponent', () => {
  let component: NewPasswordsComponent;
  let fixture: ComponentFixture<NewPasswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordsComponent]
    });
    fixture = TestBed.createComponent(NewPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
