import { Cliente } from "./cliente.interface";

export interface RetiroResponse {
  id: number;
  mes: number;
  anio: number;
  creadoEn: string;
  actualizadoEn: string;
  totalRetiradoDelMes: number;
  cliente: Cliente;
  mesActual: number;
  nombreMesActual: string;
  totalSistemaActualizado: number

}
