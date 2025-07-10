export interface Cliente {
  id: number;
  dni: string;
  nombres: string;
  telefono: string;
  direccion?: string;
  lugarNacimiento?: string;
  telefono2?: string;
  cumple?: string | null;
  creadoEn: string;
  actualizadoEn: string;
  // totalCuotasMes: number;
}

