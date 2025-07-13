import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service'; // agregado
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../ui-components/loader/loader.component';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    LoaderComponent
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();

  error = '';
  loading = false;


  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService, // inyectado
    private snackBar: MatSnackBar
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.loginForm.controls;
  }

  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;
    this.loading = true;
    this.error = '';

    this.authService.login(username!, password!).subscribe({

      next: () => {
        this.router.navigate(['/pages/clientes'])
      },
      error: (err) => {

        this.loading = false;
        this.snackBar.open(err.error.message, undefined, {
          duration: 2500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-error']
        });


      },
      complete: () => {
        this.loading = false;
        this.snackBar.open('Bienvenido a CHANCHITO', undefined, {
          duration: 1500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['bg-success']
        });
      }
    });
  }

}
