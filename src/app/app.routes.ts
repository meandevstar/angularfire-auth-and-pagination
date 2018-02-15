import { Routes } from '@angular/router';
import { LoginComponent } from './main/login/login.component';
import { SignUpComponent } from './main/signup/signup.component';
import { IsLoggedInGuard } from 'app/guards/isLoggedIn.guard';
import { IsNotLoggedInGuard } from 'app/guards/isNotLoggedIn.guard';

export const AppRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    { path: '', loadChildren: 'app/main/main.module#MainModule', canActivate: [IsLoggedInGuard]},
    { path: 'signup', component: SignUpComponent, canActivate: [IsNotLoggedInGuard] },
    { path: 'login', component: LoginComponent, canActivate: [IsNotLoggedInGuard] },
    { path: '**', redirectTo: 'login' }
];