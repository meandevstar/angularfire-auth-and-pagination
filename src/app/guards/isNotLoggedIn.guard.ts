import { CanActivate, CanActivateChild } from '@angular/router';
import { IsLoggedInGuard } from './isLoggedIn.guard';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class IsNotLoggedInGuard implements CanActivate, CanActivateChild {
	constructor (
		private isLoggedInGuard: IsLoggedInGuard,
		private router: Router
	) {}

	canActivate() {
		return this.isLoggedInGuard.isLoggedIn().then(isAuth => {
			if (isAuth) {
				this.router.navigate(['/dashboard']);
			}
			return !isAuth;
		});
	}

	canActivateChild() {
		return this.isLoggedInGuard.isLoggedIn().then(a => !a);
	}
}