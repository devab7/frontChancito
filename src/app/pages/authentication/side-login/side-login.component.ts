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

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    private authService: AuthService // inyectado
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('trabajador', [Validators.required, Validators.minLength(3)]), // renombrado
    password: new FormControl('789', [Validators.required]),
  });

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.loading = true;
    this.error = '';

    this.authService.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/pages/clientes']),
      error: (err) => {

        console.log('Error de autenticación:', err.error.message || 'Credenciales inválidas');

        this.error = err.error?.message || 'Credenciales inválidas';
        this.loading = false;
      },
    });
  }

}
