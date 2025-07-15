import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthSessionInterceptor implements HttpInterceptor {
  private authService = inject(AuthService); // Servicio que maneja tokens y sesión
  private router = inject(Router); // Para redirección al login si la sesión falla

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🧠 1. Excluir rutas públicas o sensibles para evitar lógica innecesaria
    const isExcluded = ['/auth/login', '/auth/register', '/auth/refresh']
      .some(url => req.url.includes(url));

    if (isExcluded) {
      // 🛑 No inyectar token ni hacer refresh sobre estas rutas
      return next.handle(req);
    }

    // 🔐 2. Adjuntar el token actual en el header si está disponible
    const token = this.authService.getAccessToken();
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}` // Estándar para JWT
          }
        })
      : req; // Si no hay token, dejar la request como está

    // 🔁 3. Flag para evitar múltiples intentos de refresh sobre la misma request
    let alreadyRetried = false;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 🔍 4. Detectar error típico de sesión expirada

       if ((error.status === 401 || error.status === 403) && !alreadyRetried) {
          alreadyRetried = true;

          // 🔄 5. Intentar renovar el token accediendo a /auth/refresh
          return this.authService.refreshToken().pipe(
            switchMap((resp: any) => {
              const newToken = resp.accessToken;

              // 🔑 6. Guardar el nuevo token en el servicio Auth
              this.authService.setAccessToken(newToken);

              // 🔂 7. Reintentar la solicitud original con el token renovado
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });

              return next.handle(retryReq);
            }),
            catchError(() => {
              // 🚪 8. Si el refresh falla, cerrar sesión y redirigir al login
              this.authService.logout().subscribe();
              this.router.navigate(['/authentication/login']);
              return throwError(() => error);
            })
          );
        }

        // 🧯 9. Si no es error 401 o ya se intentó refresh, propagar el error tal cual
        return throwError(() => error);
      })
    );
  }
}
