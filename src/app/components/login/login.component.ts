import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Eliminamos el selector de rol manual; la base de datos lo asigna al autenticar
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.cargando = true;
    this.errorMsg = '';
    const { correo, password } = this.loginForm.value;

    // Llamada real al endpoint /api/login
    this.authService.login(correo, password).subscribe({
      next: () => {
        this.cargando = false;
        // Al actualizarse usuario$ en AuthService, app.component.html mostrará el panel automáticamente
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.error || 'Error de conexión con el servidor. Verifica tus credenciales.';
      },
    });
  }
}
