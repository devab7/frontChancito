import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/auth`

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.http.get<{ accessToken: string }>(`${this.apiUrl}/refresh`, {
            withCredentials: true
          }).pipe(
            switchMap((resp) => {
              this.authService.setAccessToken(resp.accessToken);
              const retried = req.clone({
                setHeaders: { Authorization: `Bearer ${resp.accessToken}` }
              });
              return next.handle(retried);
            }),
            catchError(() => {
              this.authService.logout();
              return throwError(() => new Error('Sesión expirada'));
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
