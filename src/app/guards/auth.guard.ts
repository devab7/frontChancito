import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode'; // ✅


export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  if (!token) return router.parseUrl('/login');

  try {
    const { exp } = jwtDecode<any>(token);
    if (Date.now() > exp * 1000) {
      authService.logout().subscribe();
      return router.parseUrl('/login');
    }
  } catch (err) {
    return router.parseUrl('/login');
  }

  return true;
};
