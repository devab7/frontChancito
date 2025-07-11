import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//interfaces
import { Cliente } from '../interfaces/cliente.interface';
import { CreateClienteDto } from '../interfaces/create-cliente.dto';
import { Cuota } from '../interfaces/cuota.interface';
import { CreateCuotaDto } from '../interfaces/cuota.dto';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  private readonly apiUrl = `${environment.API_URL}/cuotas`

  constructor(private http: HttpClient) {}

  // Crear cuota
  create(cuota: CreateCuotaDto): Observable<Cuota> {
    return this.http.post<Cuota>(this.apiUrl, cuota);
  }

  // Obtener todas las cuotas
  findAll(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(this.apiUrl);
  }

  // Obtener todas las cuotas del día
  findAllCuotasDia(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.apiUrl}/reporte/dia`);
  }

   // Obtener todas las cuotas mensuales
  findAllCuotasMensuales(): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.apiUrl}/reporte/mensual`);
  }

  // Obtener un cuota por ID
  findOne(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un cliente
  // update(id: number, cliente: UpdateClienteDto): Observable<Cliente> {
  //   return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  // }

  // Eliminar una cuota
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener cuota base del mes del cliente
  // getCuotaBaseDelMes(clienteId: number) {
  //   return this.http.get<any>(`${this.apiUrl}/base-del-mes/${clienteId}`);
  // }

  getCuotaBaseDelMes(clienteId: number, mes?: string) {
    const options = mes ? { params: { mes } } : {};
    return this.http.get<any>(`${this.apiUrl}/base-del-mes/${clienteId}`, options);
  }




}
