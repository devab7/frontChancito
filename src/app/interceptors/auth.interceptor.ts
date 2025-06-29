import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Intenta refresh automático
          return this.authService.refreshToken().pipe(
            switchMap((resp: any) => {
              const newToken = resp.accessToken;
              this.authService.setAccessToken(newToken);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });

              return next.handle(retryReq);
            }),
            catchError(() => {
              this.authService.logout().subscribe();
              this.router.navigate(['/authentication/login']);
              return throwError(() => error);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
