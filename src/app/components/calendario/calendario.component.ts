import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipamientoService } from '../../services/equipamiento.service';

interface BloqueHorario {
  rango: string;
  lunes: any;
  martes: any;
  miercoles: any;
  jueves: any;
  viernes: any;
  sabado: any;
  domingo: any;
}

interface DiaCalendario {
  fechaString: string;
  numeroDia: number;
  esMesActual: boolean;
  eventos: any[];
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html'
})
export class CalendarioComponent implements OnInit {
  // Filtros obligatorios requeridos conectados a SQLite
  filters = {
    localidad: '',
    cdc: '',
    tipo: '',
    codigo: '',
    fechaInicio: '',
    nombreCurso: ''
  };

  mesActual: Date = new Date(2026, 8, 1); // Septiembre 2026
  nombreMesAnio: string = 'Septiembre 2026';
  
  diasDelMes: DiaCalendario[] = [];
  sesionesClasificadas: any[] = [];
  bloquesCalendario: BloqueHorario[] = []; // 👈 Declaración unificada de la matriz
  sesionSeleccionada: any = null;

  // Catálogos de filtrado en cascada
  equipamientosDisponibles: any[] = [];
  localidadesFiltro: string[] = [];
  cdcsFiltro: string[] = [];
  tiposFiltro: string[] = [];
  codigosFiltro: string[] = [];

  franjasBase = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00'
  ];

  constructor(private equipamientoService: EquipamientoService) {}

  ngOnInit(): void {
    this.cargarSelectoresFiltros();
    this.generarMatrizMensual();
    this.inicializarMatrizVacia();
  }

  cargarSelectoresFiltros(): void {
    this.equipamientoService.obtenerEquipamientosSelector().subscribe(data => {
      this.equipamientosDisponibles = data;
      this.localidadesFiltro = [...new Set(data.map(e => e.nombre_localidad))];
      this.consultarProgramacionBD();
    });
  }

  onFiltroChange(nivel: number): void {
    if (nivel === 1) { this.filters.cdc = ''; this.filters.tipo = ''; this.filters.codigo = ''; this.cdcsFiltro = []; }
    if (nivel === 2) { this.filters.tipo = ''; this.filters.codigo = ''; this.tiposFiltro = []; }
    if (nivel === 3) { this.filters.codigo = ''; this.codigosFiltro = []; }

    const filtrados = this.equipamientosDisponibles.filter(e => 
      (!this.filters.localidad || e.nombre_localidad === this.filters.localidad) &&
      (!this.filters.cdc || e.nombre_cdc === this.filters.cdc) &&
      (!this.filters.tipo || e.tipo === this.filters.tipo)
    );

    if (nivel === 1 && this.filters.localidad) this.cdcsFiltro = [...new Set(filtrados.map(e => e.nombre_cdc))];
    if (nivel === 2 && this.filters.cdc) this.tiposFiltro = [...new Set(filtrados.map(e => e.tipo))];
    if (nivel === 3 && this.filters.tipo) this.codigosFiltro = filtrados.map(e => e.codigo_enumerado || e.codigo_encrypted);

    this.consultarProgramacionBD();
  }

  generarMatrizMensual(): void {
    this.diasDelMes = [];
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    const primerDiaMes = new Date(año, mes, 1);
    const ultimoDiaMes = new Date(año, mes + 1, 0);

    let diaInicioSemana = primerDiaMes.getDay();
    if (diaInicioSemana === 0) diaInicioSemana = 7;

    for (let i = diaInicioSemana - 1; i > 0; i--) {
      const d = new Date(año, mes, 1 - i);
      this.diasDelMes.push(this.crearObjetoDia(d, false));
    }

    for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
      const d = new Date(año, mes, i);
      this.diasDelMes.push(this.crearObjetoDia(d, true));
    }

    const celdasRestantes = 42 - this.diasDelMes.length;
    for (let i = 1; i <= celdasRestantes; i++) {
      const d = new Date(año, mes + 1, i);
      this.diasDelMes.push(this.crearObjetoDia(d, false));
    }
  }

  private crearObjetoDia(date: Date, esMesActual: boolean): DiaCalendario {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return {
      fechaString: `${y}-${m}-${d}`,
      numeroDia: date.getDate(),
      esMesActual,
      eventos: []
    };
  }

  inicializarMatrizVacia(): void {
    this.bloquesCalendario = this.franjasBase.map(rango => ({
      rango,
      lunes: null, martes: null, miercoles: null, jueves: null, viernes: null, sabado: null, domingo: null
    }));
  }

  obtenerSesionDia(bloque: BloqueHorario, dia: string): any {
    return (bloque as any)[dia];
  }

  // 👈 CONSULTA CORREGIDA CON ENLACE DIRECTO DE MAPEO A SQLITE
  consultarProgramacionBD(): void {
    this.inicializarMatrizVacia();

    this.equipamientoService.obtenerCalendario(this.filters).subscribe({
      next: (data) => {
        this.sesionesClasificadas = data;
        
        // Inyectar en celdas de la matrícula mensual
        this.diasDelMes.forEach(dia => {
          dia.eventos = this.sesionesClasificadas.filter(s => s.fecha_sesion === dia.fechaString);
        });

        // Sincronizar bloques horarios
        this.bloquesCalendario.forEach(bloque => {
          const [horaInicioBloque] = bloque.rango.split(' - ');

          const ocupacionesEnBloque = this.sesionesClasificadas.filter(s => 
            s.hora_inicio >= horaInicioBloque && 
            s.hora_inicio < this.calcularHoraFinToken(horaInicioBloque)
          );

          ocupacionesEnBloque.forEach(sesion => {
            const diaNorm = this.normalizarDiaSemana(sesion.dia_semana);
            if (diaNorm && diaNorm in bloque) {
              (bloque as any)[diaNorm] = {
                id: sesion.id,
                curso: sesion.nombre_curso, 
                espacio: `${sesion.tipo} — ${sesion.codigo_enumerado}`,
                estado: sesion.estado_sesion || 'Programada', 
                asistentes_reales: sesion.asistentes_reales || 0,
                motivo: sesion.motivo,
                novedades: sesion.observaciones,
                fecha_sesion: sesion.fecha_sesion,
                hora_inicio: sesion.hora_inicio,
                hora_fin: sesion.hora_fin
              };
            }
          });
        });
      },
      error: (err) => console.error('Error al actualizar distribución horaria:', err)
    });
  }

  calcularHoraFinToken(horaInicio: string): string {
    const [horas] = horaInicio.split(':');
    return `${String(Number(horas) + 2).padStart(2, '0')}:00`;
  }

  normalizarDiaSemana(dia: string): string {
    if (!dia) return '';
    const mapa: { [key: string]: string } = {
      'lunes': 'lunes', 'martes': 'martes', 'miércoles': 'miercoles', 'miercoles': 'miercoles',
      'jueves': 'jueves', 'viernes': 'viernes', 'sábado': 'sabado', 'sabado': 'sabado', 'domingo': 'domingo'
    };
    return mapa[dia.toLowerCase()] || '';
  }

  abrirVentanaEmergente(evento: any): void {
    this.sesionSeleccionada = evento;
  }

  cerrarVentanaEmergente(): void {
    this.sesionSeleccionada = null;
  }

  esHoy(fechaString: string): boolean {
    return fechaString === `2026-09-25`;
  }
} 
