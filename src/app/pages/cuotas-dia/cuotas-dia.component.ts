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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CuotasService } from 'src/app/services/cuotas.service';
import { Cuota } from 'src/app/interfaces/cuota.interface';
import { TipoPagoColorDirective } from 'src/app/shared/directives/tipo-pago-color.directive';

export interface Employee {
  id: number;
  fecha: Date;
  cliente: string;
  importe: number;

}



@Component({
  templateUrl: './cuotas-dia.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    RouterModule,
    TipoPagoColorDirective
  ],
  providers: [DatePipe],
})
export class CuotasDia implements OnInit, AfterViewInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'cliente',
    'importe',
    'tipoPago',
    'fecha',
    // 'action',
  ];
  dataSource = new MatTableDataSource<Cuota>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  cuotasDia: Cuota[] = [];
  totalCuotasDia: number;
  totalPorTipoPago: Record<string, string> = {};

  constructor(public dialog: MatDialog, public datePipe: DatePipe, private cuotasService: CuotasService) {}


  ngOnInit(): void {

      this.cuotasService.findAllCuotasDia().subscribe((data:any) => {

        console.log(data);


        this.cuotasDia = data.cuotas;
        this.totalCuotasDia = data.totalCuotasDelDia;
        this.totalPorTipoPago = data.totalPorTipoPago;
        this.dataSource = new MatTableDataSource(data.cuotas);
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const texto = filter.trim().toLowerCase();
          return (
            data.cliente.nombres.toLowerCase().includes(texto)
          );
        };

        // console.log(data);

      })


  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
      } else if (result.event === 'Update') {
        // this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }


  // tslint:disable-next-line - Disables all
  // addRowData(row_obj: Employee): void {
  //   this.dataSource.data.unshift({
  //     id: employees.length + 1,
  //     importe: row_obj.importe,
  //     fecha: row_obj.fecha,
  //     cliente: row_obj.cliente,
  //   });
  //   this.dialog.open(AppAddKichenSinkComponent);
  //   this.table.renderRows();
  // }

  // tslint:disable-next-line - Disables all
  // updateRowData(row_obj: Employee): boolean | any {
  //   this.dataSource.data = this.dataSource.data.filter((value: any) => {
  //     if (value.id === row_obj.id) {
  //       value.dni = row_obj.dni;
  //       value.nombrecompleto = row_obj.nombrecompleto;
  //       value.direccion = row_obj.dirección;
  //       value.telefono = row_obj.telefono;
  //       value.cumpleanos = row_obj.cumpleanos;
  //       value.lugar = row_obj.lugar;
  //       value.telefono2 = row_obj.telefono2;
  //       // value.imagePath = row_obj.imagePath;
  //     }
  //     return true;
  //   });
  // }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }
}

// @Component({
//   selector: 'app-dialog-content',
//   standalone: true,
//   imports: [MatDialogModule, FormsModule, MaterialModule],
//   providers: [DatePipe],
//   templateUrl: 'cuotas-dialog-content.html',
// })
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
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
    this.dialogRef.close({ event: this.action, data: this.local_data });
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
