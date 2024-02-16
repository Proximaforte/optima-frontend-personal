import { CanActivateFn } from '@angular/router';

export const othersGuard: CanActivateFn = (route, state) => {
  return true;
};
