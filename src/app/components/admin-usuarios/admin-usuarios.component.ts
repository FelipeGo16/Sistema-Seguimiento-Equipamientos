import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.component.html',
})
export class AdminUsuariosComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  formUsuario!: FormGroup;
  usuarios: any[] = [];
  logs: any[] = [];
  mostrarLogs: boolean = false;
  verPassword: boolean = false;

  // Catálogos solicitados
  localidades = ['Nivel Nacional (Todas)', 'Suba', 'Kennedy', 'Bosa', 'Barrios Unidos', 'Usaquén'];
  perfiles = ['Nivel Central', 'Nivel Local'];
  roles = ['Administrador', 'Creador - Editor', 'Visualizador'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      localidad: ['', Validators.required],
      perfil: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>(`${this.apiUrl}/usuarios`).subscribe((data) => {
      this.usuarios = data;
    });
  }

  registrarUsuario() {
    if (this.formUsuario.invalid) return;

    this.http.post(`${this.apiUrl}/usuarios`, this.formUsuario.value).subscribe({
      next: () => {
        alert('✅ Usuario registrado exitosamente');
        this.formUsuario.reset({ localidad: '', perfil: '', rol: '' });
        this.cargarUsuarios();
      },
      error: (err) => alert('Error al registrar usuario: ' + err.error?.error),
    });
  }

  restaurarClave(usuario: any) {
    const nuevaClave = prompt(`Ingrese la nueva contraseña temporal para ${usuario.nombre}:`);
    if (nuevaClave && nuevaClave.trim().length >= 4) {
      this.http.put(`${this.apiUrl}/usuarios/${usuario.id}/clave`, { nuevaClave }).subscribe(() => {
        alert('🔑 Contraseña actualizada correctamente.');
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Está seguro de eliminar esta cuenta de usuario?')) {
      this.http.delete(`${this.apiUrl}/usuarios/${id}`).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  exportarBaseDatos() {
    window.open(`${this.apiUrl}/admin/exportar-bd`, '_blank');
  }

  abrirModalLogs() {
    this.http.get<any[]>(`${this.apiUrl}/admin/logs`).subscribe((data) => {
      this.logs = data;
      this.mostrarLogs = true;
    });
  }
}
