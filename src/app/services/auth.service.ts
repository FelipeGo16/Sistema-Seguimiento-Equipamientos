import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UsuarioSesion {
  id: number;
  username: string;
  correo: string;
  localidad: string;
  perfil: 'Nivel Central' | 'Nivel Local';
  rol: 'Administrador' | 'Creador - Editor' | 'Visualizador';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private usuarioSubject = new BehaviorSubject<UsuarioSesion | null>(null);

  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    // Recuperar sesión activa si se recarga la página
    const guardado = localStorage.getItem('usuario_actual');
    if (guardado) {
      this.usuarioSubject.next(JSON.parse(guardado));
    }
  }

  // Obtener el valor síncrono del usuario actual
  get usuarioActual(): UsuarioSesion | null {
    return this.usuarioSubject.value;
  }

  login(correo: string, password: string): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((user) => {
        localStorage.setItem('usuario_actual', JSON.stringify(user));
        this.usuarioSubject.next(user);
      }),
    );
  }

  // Valida si el rol actual permite crear o editar registros
  puedeEditar(): boolean {
    const rol = this.usuarioActual?.rol;
    return rol === 'Administrador' || rol === 'Creador - Editor';
  }

  canManageEquipments(): boolean {
    return this.puedeEditar();
  }

  // Agrega este método para Ocupación
  canManageOcupacion(): boolean {
    return this.puedeEditar();
  }

  logout(): void {
    localStorage.removeItem('usuario_actual');
    this.usuarioSubject.next(null);
  }
}
