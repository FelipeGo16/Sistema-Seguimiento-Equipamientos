import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { EquipamientoService } from '../../services/equipamiento.service';

@Component({
  selector: 'app-calendario-sesiones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrls: [],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  usuarioPerfil: string = 'local';
  mostrarModalRegistro: boolean = false;
  mostrarModalDetalle: boolean = false;

  fechaSeleccionada: string = '';
  sesionSeleccionada: any = null;

  formFiltros!: FormGroup;
  formSesion!: FormGroup;

  estadosDisponibles = ['Programada', 'Realizada', 'Cancelada'];
  localidades = ['Suba', 'Kennedy', 'Usaquén', 'Bosa'];
  cdcs = ['CDC El Retiro', 'CDC Bellavista', 'CDC Lago'];
  equipamientos = ['Aulas virtuales', 'Auditorio', 'Laboratorio'];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today',
    },
    selectable: false,
    eventClick: this.handleEventClick.bind(this),
    events: [],
  };

  constructor(
    private fb: FormBuilder,
    private equipamientoService: EquipamientoService,
  ) {
    this.inicializarFiltros();
    this.inicializarFormularioSesion();
  }

  ngOnInit() {
    this.cargarDatosDesdeBD();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().updateSize();
      }
    }, 150);
  }

  inicializarFiltros() {
    this.formFiltros = this.fb.group({
      localidad: [''],
      cdc: [''],
      tipoEquipamiento: [''],
      buscarCurso: [''],
    });

    this.formFiltros.valueChanges.subscribe(() => {
      this.cargarDatosDesdeBD();
    });
  }

  inicializarFormularioSesion() {
    this.formSesion = this.fb.group(
      {
        titulo: ['', [Validators.required, Validators.maxLength(50)]],
        fechaSesion: ['', Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required],
        estado: ['Programada', Validators.required],
      },
      { validators: this.validarHoras },
    );
  }

  validarHoras(group: FormGroup) {
    const inicio = group.get('horaInicio')?.value;
    const fin = group.get('horaFin')?.value;
    return inicio && fin && inicio >= fin ? { horaInvalida: true } : null;
  }

    cargarDatosDesdeBD() {
    const valoresFiltro = this.formFiltros.value;
    
    const payloadFiltros = {
      localidad: valoresFiltro.localidad,
      cdc: valoresFiltro.cdc,
      tipo: valoresFiltro.tipoEquipamiento,
      nombreCurso: valoresFiltro.buscarCurso
    };

    this.equipamientoService.obtenerCalendario(payloadFiltros).subscribe({
      next: (data: any[]) => {
        this.calendarOptions.events = data.map(sesion => {
          const fecha = sesion.fecha_sesion || '';
          const inicio = sesion.hora_inicio_uso || '00:00';
          const fin = sesion.hora_fin_uso || '00:00';
          const estado = sesion.estado_sesion || 'Programada';

          return {
            // Si el JOIN trae el nombre_curso lo usa, sino usa un texto por defecto con el ID
            title: sesion.nombre_curso ? sesion.nombre_curso.toUpperCase() : `CURSO ID: ${sesion.curso_id}`,
            start: `${fecha}T${inicio}`,
            end: `${fecha}T${fin}`,
            extendedProps: {
              localidad: sesion.localidad,
              cdc: sesion.cdc,
              equipamiento_enumerado: sesion.equipamiento_enumerado,
              hora_inicio_uso: inicio,
              hora_fin_uso: fin,
              estado_sesion: estado
            },
            color: '#0078d4' // Azul Outlook corporativo
          };
        });
      },
      error: (err) => console.error('Error al consultar el endpoint /api/calendario:', err)
    });
  }

  onCalendarioDblClick(event: MouseEvent) {
    if (this.usuarioPerfil !== 'local') {
      alert('Tu perfil no tiene permisos para registrar sesiones.');
      return;
    }
    const target = event.target as HTMLElement;
    const cell = target.closest('.fc-day') as HTMLElement;
    if (cell) {
      const fechaAttr = cell.getAttribute('data-date');
      if (fechaAttr) {
        this.fechaSeleccionada = fechaAttr;
        this.mostrarModalRegistro = true;

        this.formSesion.patchValue({
          fechaSesion: this.fechaSeleccionada,
          horaInicio: '10:00',
          horaFin: '11:00',
          estado: 'Programada',
        });
      }
    }
  }

  // Captura el clic del curso y asume las características de la ventana flotante requerida
  handleEventClick(clickInfo: EventClickArg) {
    const props = clickInfo.event.extendedProps;

    this.sesionSeleccionada = {
      title: clickInfo.event.title,
      localidad: props['localidad'] || 'No especificada',
      cdc: props['cdc'] || 'No especificado',
      equipamiento_enumerado: props['equipamiento_enumerado'] || 'No especificado',
      hora_inicio_uso: props['hora_inicio_uso'] || '--:--',
      hora_fin_uso: props['hora_fin_uso'] || '--:--',
      estado_sesion: props['estado_sesion'] || 'Programada',
    };

    this.mostrarModalDetalle = true;
  }

  onSubmitSesion() {
    if (this.formSesion.valid) {
      const datosForm = this.formSesion.value;

      const payloadNuevaSesion = {
        titulo: datosForm.titulo,
        fecha_sesion: datosForm.fechaSesion,
        hora_inicio: datosForm.horaInicio,
        hora_fin: datosForm.horaFin,
        estado: datosForm.estado,
      };

      this.equipamientoService.registrarSesion(payloadNuevaSesion).subscribe({
        next: () => {
          this.mostrarModalRegistro = false;
          this.formSesion.reset();
          this.cargarDatosDesdeBD();
        },
        error: (err) => console.error('Error registrando sesión:', err),
      });
    }
  }
}
