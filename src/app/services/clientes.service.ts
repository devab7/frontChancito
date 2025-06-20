import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//interfaces
import { Cliente } from '../interfaces/cliente.interface';
import { CreateClienteDto } from '../interfaces/create-cliente.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private readonly apiUrl = `${environment.API_URL}/clientes`

  constructor(private http: HttpClient) {}

  // Crear cliente
  create(cliente: CreateClienteDto): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // Obtener todos los clientes
  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  findOne(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Actualizar un cliente
  // update(id: number, cliente: UpdateClienteDto): Observable<Cliente> {
  //   return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  // }

  // Eliminar un cliente
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.apiUrl}/${id}`);
  }

}
