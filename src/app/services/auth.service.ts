import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Usuario {
  username: string;
  rol: "Nivel Central" | "Equipo Local" | "Administrador";
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  constructor() {
    // Intenta recuperar sesión previa del almacenamiento local
    const savedUser = localStorage.getItem("session_user");
    if (savedUser) {
      this.usuarioSubject.next(JSON.parse(savedUser));
    }
  }

  get usuario$(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  login(
    username: string,
    rol: "Nivel Central" | "Equipo Local" | "Administrador",
  ): boolean {
    const usuario: Usuario = { username, rol };
    localStorage.setItem("session_user", JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
    return true;
  }

  logout(): void {
    localStorage.removeItem("session_user");
    this.usuarioSubject.next(null);
  }

  // Guardias de permisos adaptados al modelo de requerimientos
  canManageEquipments(): boolean {
    const rol = this.usuarioActual?.rol;
    return rol === "Administrador" || rol === "Nivel Central";
  }

  canManageOcupacion(): boolean {
    const rol = this.usuarioActual?.rol;
    return rol === "Administrador" || rol === "Equipo Local";
  }
}
