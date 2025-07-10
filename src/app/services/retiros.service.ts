import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRetiroDto } from '../dtos/create-retiro.dto';
import { RetiroResponse } from '../interfaces/retiro-response.interface';
import { environment } from 'src/environments/environment';



// export interface Cliente {
//   id: number;
//   dni: string;
//   nombres: string;
//   telefono: string;
//   direccion: string;
//   lugarNacimiento: string;
//   telefono2?: string;
//   cumple?: string; // Formato ISO
// }



@Injectable({ providedIn: 'root' })
export class RetirosService {

  private readonly apiUrl = `${environment.API_URL}/retiro-mes`

  constructor(private http: HttpClient) {}

  retirarMes(dto: CreateRetiroDto): Observable<RetiroResponse> {
    return this.http.post<RetiroResponse>(this.apiUrl, dto);
  }
}
