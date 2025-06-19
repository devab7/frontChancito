import { Cliente } from "./cliente.interface";

export interface Cuota {
  id: number;
  importe: number;
  creadoEn: Date;
  actualizadoEn: Date;
  cliente: Cliente
}

