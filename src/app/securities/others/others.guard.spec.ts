import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { othersGuard } from './others.guard';

describe('othersGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => othersGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
