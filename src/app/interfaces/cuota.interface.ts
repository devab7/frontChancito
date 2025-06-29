import { Cliente } from "./cliente.interface";

export interface Cuota {
  id: number;
  cuota: number;
  creadoEn: Date;
  actualizadoEn: Date;
  cliente: Cliente;
  tipoPago: string;
}

