import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  private usuario: any = null;
  private readonly apiUrl = `${environment.API_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((resp) => {
        this.setAccessToken(resp.accessToken);
        this.usuario = resp.usuario;
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.token = null;
        localStorage.removeItem('accessToken');
      })
    );
  }

  refreshToken() {
    return this.http.post(`${this.apiUrl}/refresh`, {}, { withCredentials: true });
  }

  setAccessToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  getAccessToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('accessToken');
    }
    return this.token;
  }

  getUsuario(): any {
    return this.usuario;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUserRol(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const { rol } = jwtDecode<any>(token);
      return rol || null;
    } catch {
      return null;
    }
  }
}
