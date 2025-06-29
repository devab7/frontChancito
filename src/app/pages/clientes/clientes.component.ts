import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { AppAddKichenSinkComponent } from './add/add.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
// interfaces
import { Cliente } from 'src/app/interfaces/cliente.interface';
// services
import { ClientesService } from 'src/app/services/clientes.service';
import { AuthService } from 'src/app/services/auth.service';

export interface Employee {
  id: number;
  dni: string;
  nombrecompleto: string;
  dirección: string;
  telefono: number;
  cumpleanos: Date;
  lugar: string;
  telefono2: number;
  // imagePath: string;
}

@Component({
  templateUrl: './clientes.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    RouterModule,
  ],
  providers: [DatePipe],
})
export class Clientes implements AfterViewInit, OnInit {

  clientes: Cliente[] = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'dni',
    'nombres',
    'telefono',
    'lugarNacimiento',
    'action',
  ];
  dataSource = new MatTableDataSource<Cliente>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);


  constructor(public dialog: MatDialog, public datePipe: DatePipe, private clientesService: ClientesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerClientes();

  }

  get rolUsuario(): string | null {
    return this.authService.getUserRol();
  }


// obtenerClientes(): void {
//   this.clientesService.findAll().subscribe((data) => {

//     console.log(data);

//     this.clientes = data;
//     this.dataSource = new MatTableDataSource(data);

//     setTimeout(() => {
//       this.dataSource.paginator = this.paginator;
//       this.table.renderRows(); // ⬅️ fuerza el render
//     });

//     this.dataSource.filterPredicate = (cliente, filtro) => {
//       const texto = filtro.trim().toLowerCase();
//       return (
//         cliente.nombres.toLowerCase().includes(texto) ||
//         cliente.dni.toLowerCase().includes(texto)
//       );
//     };
//   });
// }

obtenerClientes(): void {
  this.clientesService.findAll().subscribe((data) => {

    console.log(data);

    // 🧠 Aseguramos orden en el frontend por si el backend falla en precisión
    const ordenados = data.sort((a, b) => {
      const fechaA = new Date(a.creadoEn).getTime();
      const fechaB = new Date(b.creadoEn).getTime();

      if (fechaB !== fechaA) return fechaB - fechaA;
      return b.id - a.id; // desempate por ID
    });

    this.clientes = ordenados;
    this.dataSource = new MatTableDataSource(ordenados);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.table.renderRows();
    });

    this.dataSource.filterPredicate = (cliente, filtro) => {
      const texto = filtro.trim().toLowerCase();
      return (
        cliente.nombres.toLowerCase().includes(texto) ||
        cliente.dni.toLowerCase().includes(texto)
      );
    };
  });
}



  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppKichenSinkDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        // this.addRowData(result.data);
        this.obtenerClientes(); // ⬅️ actualiza desde el backend
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
                // this.obtenerClientes(); // ⬅️ actualiza desde el backend

        this.deleteRowData(result.data);
      }
    });
  }


  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.dni = row_obj.dni;
        value.nombrecompleto = row_obj.nombrecompleto;
        value.direccion = row_obj.dirección;
        value.telefono = row_obj.telefono;
        value.cumpleanos = row_obj.cumpleanos;
        value.lugar = row_obj.lugar;
        value.telefono2 = row_obj.telefono2;
        // value.imagePath = row_obj.imagePath;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(cliente: Cliente): boolean | any {



    this.clientesService.delete(cliente.id).subscribe(() => {
      this.obtenerClientes(); // ⬅️ actualiza desde el backend
    });
    console.log(cliente);


  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: 'clientes-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  clienteForm!: FormGroup;


  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee,
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {

    this.clienteForm = this.fb.group({
      dni: [data.dni || '', [Validators.required, Validators.minLength(8)]],
      nombres: [data.nombrecompleto || '', Validators.required],
      telefono: [data.telefono || '', Validators.required],
      direccion: [data.dirección || ''],
      lugarNacimiento: [data.lugar || ''],
      telefono2: [data.telefono2 || ''],
      cumple: [data.cumpleanos || null]
    });


    this.local_data = { ...data };
    this.action = this.local_data.action;
    // if (this.local_data.DateOfJoining !== undefined) {
    //   this.joiningDate = this.datePipe.transform(
    //     new Date(this.local_data.DateOfJoining),
    //     'yyyy-MM-dd'
    //   );
    // }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

doAction(): void {
  if (this.action === 'Delete') {

     this.dialogRef.close({ event: 'Delete', data: this.local_data });

  } else {
    if (this.clienteForm.invalid) return;

    // this.clientesService.create(this.clienteForm.value).subscribe(cliente => {
    //   this.dialogRef.close({ event: 'Add', data: cliente });
    // });

      const raw = this.clienteForm.getRawValue();

      const dto = {
        ...raw,
        cumple: raw.cumple
          ? new Date(raw.cumple).toISOString().slice(0, 10)  // 🔥 "yyyy-MM-dd"
          : null
      };

      this.clientesService.create(dto).subscribe(cliente => {
        this.dialogRef.close({ event: 'Add', data: cliente });
      });



  }
}


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}
