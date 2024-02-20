import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { othersGuard } from './securities/others/others.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate:[othersGuard]
  },
  {
    path: 'utilities',
    loadChildren: () =>
      import('./utilities/utilities.module').then((m) => m.UtilitiesModule),
      canActivate:[othersGuard]
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
