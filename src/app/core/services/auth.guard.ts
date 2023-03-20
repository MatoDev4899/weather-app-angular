import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  isCitySelected = false;

  constructor(private router: Router) {
    if (localStorage.getItem('city')) {
      this.isCitySelected = true;
    }
  }

  private isAuthenticated(): boolean {
    return this.isCitySelected;
  }

  authenticate(): void {
    this.isCitySelected = true;
  }

  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isCitySelected = this.isAuthenticated();
    if (isCitySelected) {
      return true;
    } else {
      return this.router.navigate(['/home']);
    }
  }
}
