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


@Component({
  selector: 'app-form-vertical',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, ReactiveFormsModule, CommonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './view.component.html',
})



export class ViewComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private clienteService = inject(ClientesService);
  private fb = inject(FormBuilder);

  // Variables para el mes actual
  // nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
  // mesCapitalizado = this.nombreMes.charAt(0).toUpperCase() + this.nombreMes.slice(1);


  clienteId!: number;
  cliente!: any; // Usamos `signals` para mejor rendimiento
  viewClienteForm!: FormGroup;


  cuotasMesForm!: FormGroup;
  displayedColumns: string[] = ['dia', 'cantidad'];
  dataSource1: any[] = [];
  totalCuotasMes: number; // Variable para almacenar el total de cuotas del mes

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.clienteId = Number(params['id']);

      this.viewClienteForm = this.fb.group({
        dni: ['', [Validators.required]],
        nombres: ['', [Validators.required]],
        telefono: [''],
        direccion: [''],
        lugarNacimiento: [''],
        telefono2: [''],
        cumple: [null]
      });

      this.clienteService.findOne(this.clienteId).subscribe(cliente => {
        this.cliente = cliente;
        this.totalCuotasMes = cliente.totalCuotasMes;

        console.log(cliente);


        this.viewClienteForm.patchValue({
          dni: cliente.dni,
          nombres: cliente.nombres,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          lugarNacimiento: cliente.lugarNacimiento,
          telefono2: cliente.telefono2,
          cumple: cliente.cumple ? new Date(cliente.cumple) : null
        });

        // 🔥 Alternativa rápida usando `as any`
        const cuotas = (cliente as any).cuotas;

        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        this.dataSource1 = cuotas
          .filter((cuota: any) => {
            const fecha = new Date(cuota.creadoEn);
            return (
              fecha.getMonth() === mesActual &&
              fecha.getFullYear() === anioActual
            );
          })
          .map((cuota: any) => ({
            dia: new Date(cuota.creadoEn).getDate(),
            cantidad: cuota.importe
          }));

        // console.table(this.dataSource1.map(item => item.dia)); // 🔎 Diagnóstico visual
      });
    });
  }


  actualizarCuotas(){}




  constructor() { }


  actualizarCliente(): void {
    if (this.viewClienteForm.invalid) return;

    const dto = this.viewClienteForm.value;
    const id = this.clienteId;

    this.clienteService.update(id, dto).subscribe({
      next: (clienteActualizado) => {
        console.log('✅ Cliente actualizado:', clienteActualizado);
        console.log(clienteActualizado);

        // Podés actualizar el estado local si lo necesitás
        this.cliente = clienteActualizado;
      },
      error: (err) => {
        console.error('❌ Error al actualizar el cliente:', err);
      }
    });
  }





}
