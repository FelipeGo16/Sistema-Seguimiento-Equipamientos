import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipamientoService {
  // URL base apuntando al servidor Express en Node.js
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Módulo 1: Registrar Equipamiento
  registrarEquipamiento(equipamientoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipamientos`, equipamientoData);
  }

  // Módulo 2 - Nivel 1: Registrar Curso
  registrarCurso(cursoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos`, cursoData);
  }

  // Módulo 2 - Nivel 2: Registrar Sesión
  registrarSesion(sesionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sesiones`, sesionData);
  }

  obtenerCursosSelector(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/selectores/cursos`);
  }

  obtenerEquipamientosSelector(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/selectores/equipamientos-activos`);
  }

  // Módulo 3: Consultar Calendario con Filtros Dinámicos
  obtenerCalendario(filtros: any): Observable<any[]> {
    let params = new HttpParams();

    // Mapear filtros vacíos o llenos a los query parameters del servidor
    if (filtros.localidad) params = params.set('localidad', filtros.localidad);
    if (filtros.cdc) params = params.set('cdc', filtros.cdc);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.codigo) params = params.set('codigo', filtros.codigo);
    if (filtros.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros.nombreCurso) params = params.set('nombreCurso', filtros.nombreCurso);

    return this.http.get<any[]>(`${this.apiUrl}/calendario`, { params });
  }
}
