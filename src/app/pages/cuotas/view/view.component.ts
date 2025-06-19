import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AppBasicTableComponent } from '../../tables/basic-table/basic-table.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-form-vertical',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './view.component.html',
})



export class ViewComponent {

  cuotasFormMes: FormGroup;

  displayedColumns: string[] = ['dia', 'cantidad'];

  dataSource1: { dia: number; cantidad: number }[] = [];




  constructor() {

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // Enero = 0

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  this.dataSource1 = Array.from({ length: daysInMonth }, (_, i) => ({
    dia: i + 1,
    cantidad: Math.floor(Math.random() * 90) + 10, // aleatorio entre 10 y 99
  }));


  }

  hide = true;
  hide2 = true;
  conhide = true;
  alignhide = true;


  // 3 accordian
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  panelOpenState = false;
}
