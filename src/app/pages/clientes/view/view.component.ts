import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppBasicTableComponent } from '../../tables/basic-table/basic-table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { CommonModule } from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import { CuotasService } from 'src/app/services/cuotas.service';
import { RetirosService } from 'src/app/services/retiros.service';
import { RetiroResponse } from 'src/app/interfaces/retiro-response.interface';
import { CreateRetiroDto } from 'src/app/dtos/create-retiro.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-form-vertical',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, ReactiveFormsModule, CommonModule, MatSnackBarModule],
  providers: [provideMomentDateAdapter()],
  templateUrl: './view.component.html',
})



export class ViewComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private clienteService = inject(ClientesService);
  private cuotasService = inject(CuotasService);
  private fb = inject(FormBuilder);
  private retiroService = inject(RetirosService);

  // Variables para el mes actual
  // nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
  // mesCapitalizado = this.nombreMes.charAt(0).toUpperCase() + this.nombreMes.slice(1);

  // Esto es para el retiro //
  mesesDisponibles: { numero: number; nombre: string }[] = [];
  resultadoRetiro: RetiroResponse | null = null;
  errorRetiro = '';
  selectedMes: number | null = null;
  // Esto es para el retiro //

  estadoMensualCliente: {} = {};


  clienteId!: number;
  cliente!: any; // Usamos `signals` para mejor rendimiento
  viewClienteForm!: FormGroup;
  cuotaBaseCliente!: string;

  cuotasMesForm!: FormGroup;
  filtroMesForm!: FormGroup;
  displayedColumns: string[] = ['dia', 'cantidad'];
  displayedColumnsRetiro: string[] = ['mes', 'total', 'fechaRetiro'];

  dataSource1: any[] = [];
  dataSourceRetiro: any[] = [];
  totalCuotasMes: number;

  mesConsulta: string;

  retiroMesForm: FormGroup;



  constructor( private snackBar: MatSnackBar ) { }



  ngOnInit() {

    // Form filtro por mes
    this.filtroMesForm = this.fb.group({
      mes: [null, Validators.required]
    });

    this.filtroMesForm.get('mes')!.valueChanges.subscribe((nuevoMes: string) => {
      this.cargarClienteConMes(nuevoMes); // se llama cuando elegís un mes
    });

    // Para el select de retiro
    this.mesesDisponibles = this.obtenerMesesHastaActual();
    // Para el select de retiro


    // Form update customer
    this.route.params.subscribe(params => {
      this.clienteId = Number(params['id']);




      this.viewClienteForm = this.fb.group({
        dni: ['', [Validators.required]],
        nombres: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        direccion: [''],
        lugarNacimiento: [''],
        telefono2: [''],
        cumple: ['']
      });

      this.cuotasService.getCuotaBaseDelMes(this.clienteId).subscribe(cuotaBase => {
        console.log('🧾 Cuota base del mes:', cuotaBase);

        this.cuotaBaseCliente = cuotaBase?.cuotaBase ?? '0';

      });


      this.clienteService.findOne(this.clienteId).subscribe(cliente => {

        this.cargarClienteConMes(); // se cargará con el mes actual por defecto

      });

    });

  }

  esRetirado(row: any): boolean {
    return row.estado === 'retirado'; // ajusta si el valor tiene mayúsculas o es booleano
  }


  realizarRetiro(): void {
    if (!this.selectedMes) return;

    const dto: CreateRetiroDto = {
      clienteId: this.clienteId,
      mes: this.selectedMes
    };

    this.errorRetiro = '';
    this.resultadoRetiro = null;

    this.retiroService.retirarMes(dto).subscribe({
      next: (data) => {
        this.resultadoRetiro = data;
        console.log(data);

        this.cargarClienteConMes();
      },
      error: (error) => {

        this.errorRetiro = error?.error?.message || 'Error al retirar mes';

        this.snackBar.open(error.error.message, undefined, {
          duration: 3500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-error']
        });
        console.log(error);
      }
    });
  }


  obtenerMesesHastaActual(): { numero: number; nombre: string }[] {

    const mesActual = new Date().getMonth() + 1;

    return Array.from({ length: mesActual }, (_, i) => {
      const numero = i + 1;
      const fecha = new Date(2025, i, 1);
      const nombre = new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(fecha);

      return { numero, nombre };
    });
  }



  cargarClienteConMes(mes?: string) {
    const options = mes ? { params: { mes } } : {};

    this.clienteService.findOne(this.clienteId, options).subscribe(cliente => {
      this.cliente = cliente;
      this.dataSourceRetiro = cliente.estadoMensual;
      // this.dataSourceRetiro = cliente.estadoMensual.filter((item:any) => item.estado === 'retirado')


      console.log(this.estadoMensualCliente);


      const mesNum = cliente.mes ?? moment().format('MM'); // fallback por si no viene
      this.mesConsulta = moment(mesNum, 'MM').locale('es').format('MMMM'); // ej: "junio"


      // // LLena el select de retiro solo con los meses hasta el nmes actual que vien del servicio para traer el cliente
      // this.mesesDisponibles = Array.from({ length: Number(cliente.mes) }, (_, i) => {
      //   const mes = i + 1;
      //   const nombre = new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(new Date(2025, i, 1));
      //   return { numero: mes, nombre };
      // });
      // // LLena el select de retiro solo con los meses hasta el nmes actual que vien del servicio para traer el cliente


      this.cuotasService.getCuotaBaseDelMes(this.clienteId, mes).subscribe(cuotaBase => {
        this.cuotaBaseCliente = cuotaBase?.cuotaBase ?? '0';
      });


      this.totalCuotasMes = cliente.totalCuotasMes;

      console.log(cliente);


      this.viewClienteForm.patchValue({
        dni: cliente.dni,
        nombres: cliente.nombres,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        lugarNacimiento: cliente.lugarNacimiento,
        telefono2: cliente.telefono2,
        // Se parsea la fecha 'DD/MM/YYYY' proveniente del backend como objeto Moment
        // para que el mat-datepicker la interprete correctamente sin desfase visual ni lógico
        cumple: cliente.cumple ? moment(cliente.cumple, 'DD/MM/YYYY') : null,



      });

      const cuotasMap: { [dia: number]: number } = {};
      for (const cuota of cliente.cuotasCompletas) {
        const fecha = new Date(cuota.creadoEn);
        const dia = fecha.getDate();
        cuotasMap[dia] = (cuotasMap[dia] || 0) + cuota.cuota;
      }

      this.dataSource1 = Object.entries(cuotasMap).map(([dia, cantidad]) => ({
        dia: Number(dia),
        cantidad: Number(cantidad)
      }));
    });
}



  // actualizarCuotas(){}




  // constructor() { }


  actualizarCliente(): void {

    if (this.viewClienteForm.invalid) return;

    // const dto = this.viewClienteForm.value;
    const raw = this.viewClienteForm.getRawValue();
    const dto = {
      ...raw,
      cumple:
        raw.cumple && moment(raw.cumple).isValid()
          ? moment(raw.cumple).format('YYYY-MM-DD') // ✅ Compatible con tu helper
          : undefined
    };

    const id = this.clienteId;

    this.clienteService.update(id, dto).subscribe({
      next: (clienteActualizado) => {
        console.log('✅ Cliente actualizado:', clienteActualizado);
        console.log(clienteActualizado);


        this.snackBar.open('Actualizado correctamente', undefined, {
          duration: 3500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-success']
        });



        // Podés actualizar el estado local si lo necesitás
        // this.cliente = clienteActualizado;
      },
      error: (err) => {
        console.error('❌ Error al actualizar el cliente:', err);
      }
    });
  }





}
