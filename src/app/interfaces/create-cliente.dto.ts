export interface CreateClienteDto {
  dni: string;
  nombres: string;
  telefono: string;
  direccion?: string;
  lugarNacimiento?: string;
  telefono2?: string;
  cumple?: Date;
}
