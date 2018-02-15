import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { IsLoggedInGuard } from '../guards/isLoggedIn.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'users',
        loadChildren: './user/user.module#UserModule',
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'tokens',
        loadChildren: './tokens/tokens.module#TokensModule',
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'dashboard',
        loadChildren: './landing-page/landing-page.module#LandingPageModule',
        canActivate: [IsLoggedInGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MainRoutingModule { }
