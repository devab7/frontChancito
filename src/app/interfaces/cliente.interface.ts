export interface Cliente {
  id: number;
  dni: string;
  nombres: string;
  telefono: string;
  direccion?: string;
  lugarNacimiento?: string;
  telefono2?: string;
  cumple?: Date;
  creadoEn: Date;
  actualizadoEn: Date;
  totalCuotasMes: number;
}

