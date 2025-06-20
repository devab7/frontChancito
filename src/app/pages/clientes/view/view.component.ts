import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppBasicTableComponent } from '../../tables/basic-table/basic-table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-form-vertical',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './view.component.html',
})



export class ViewComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private clienteService = inject(ClientesService);
  private fb = inject(FormBuilder);

  // Variables para el mes actual
  nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
  mesCapitalizado = this.nombreMes.charAt(0).toUpperCase() + this.nombreMes.slice(1);


  clienteId!: number;
  cliente!: any; // Usamos `signals` para mejor rendimiento
  viewClienteForm!: FormGroup;


  cuotasMesForm!: FormGroup;
  displayedColumns: string[] = ['dia', 'cantidad'];
  dataSource1: any[] = [];
  totalCuotasMes: number; // Variable para almacenar el total de cuotas del mes

  ngOnInit() {

      this.route.params.subscribe(params => {
        this.clienteId = Number(params['id']); // Captura el ID de la URL

        // console.log(this.clienteId);

        this.viewClienteForm = this.fb.group({
          dni: [''],
          nombres: [''],
          telefono: [''],
          direccion: [''],
          lugarNacimiento: [''],
          telefono2: [''],
          cumpleanos: ['']
        });
      });

      this.clienteService.findOne(this.clienteId).subscribe(cliente => {

        this.cliente = cliente;
        this.totalCuotasMes = cliente.totalCuotasMes
        console.log(this.cliente);

        // Inicializa el formulario con los datos del cliente
        this.viewClienteForm.patchValue({
          dni: cliente.dni,
          nombres: cliente.nombres,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          lugarNacimiento: cliente.lugarNacimiento,
          telefono2: cliente.telefono2,
          cumpleanos: cliente.cumple
        });

         this.dataSource1 = []; // 🔥 Limpieza preventiva

        this.dataSource1 = this.cliente.cuotas.map((cuota:any) => ({
          dia: new Date(cuota.creadoEn).getDate(),
          cantidad: cuota.importe
        }));

      })


      // setTimeout(() => {


      //     this.dataSource1 = this.cliente.cuotas.map((cuota:any) => ({
      //     dia: new Date(cuota.creadoEn).getDate(),
      //     cantidad: cuota.importe
      //   }));

      // },1500)



  }

  actualizarCuotas(){}




  constructor() { }







}
