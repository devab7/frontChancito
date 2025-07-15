import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CreateRetiroDto } from '../dtos/create-retiro.dto';
import { RetiroResponse } from '../interfaces/retiro-response.interface';
import { environment } from 'src/environments/environment';




@Injectable({ providedIn: 'root' })
export class RetirosService {

  private totalSistemaActualizado$ = new BehaviorSubject<number>(0);
  private readonly apiUrl = `${environment.API_URL}/retiro-mes`

  constructor(private http: HttpClient) {}

  retirarMes(dto: CreateRetiroDto): Observable<RetiroResponse> {
    return this.http.post<RetiroResponse>(this.apiUrl, dto);
  }

  actualizarTotalDesdeRetiro(total: number): void {
    this.totalSistemaActualizado$.next(total);
  }

  escucharTotalActualizado(): Observable<number> {
    return this.totalSistemaActualizado$.asObservable();
  }


}
