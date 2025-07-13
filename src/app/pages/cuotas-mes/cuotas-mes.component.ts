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
import { LoaderComponent } from '../ui-components/loader/loader.component';

@Component({
  selector: 'app-cuotas-mes',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    RouterModule,
    TipoPagoColorDirective,
    LoaderComponent
  ],
  templateUrl: './cuotas-mes.component.html',
  styles: ``
})
export class CuotasMesComponent implements OnInit {

  loading:boolean = true;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'mes',
    'total',
    'tipoPago',
  ];

  dataSource = new MatTableDataSource<Cuota>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  totalPorTipoPago: { nombre: string; monto: number }[] = []; // 🔧 AGREGADO: inicialización segura
  totalAnual: number = 0;

  constructor( private cuotasService: CuotasService) {}

  ngOnInit(): void {

      this.cuotasService.findAllCuotasMensuales().subscribe((data:any) => {

        this.loading = false;

        this.totalAnual = data.totalAnual;
        this.totalPorTipoPago = data.totalPorTipoPago;
        this.dataSource = new MatTableDataSource(data.resumenMensual);
        // this.dataSource.paginator = this.paginator;

        // this.dataSource.filterPredicate = (data: any, filter: string) => {
        //   const texto = filter.trim().toLowerCase();
        //   return (
        //     data.cliente.nombres.toLowerCase().includes(texto)
        //   );
        // };


      })


  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTotalPorTipo(tipo: string): number {
    const entry = this.totalPorTipoPago.find(t => t.nombre === tipo);
    return entry?.monto ?? 0;
  }



}
