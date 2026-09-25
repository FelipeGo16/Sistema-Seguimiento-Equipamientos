import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { EquipamientoService } from '../../services/equipamiento.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ocupacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ocupacion.component.html',
})
export class OcupacionComponent implements OnInit {
  cursoForm!: FormGroup;
  sesionForm!: FormGroup;

  componentesServicioList = [
    'INCLUSION PRODUCTIVA',
    'INCLUSION SOCIAL',
    'PARTICIPATIVO Y COMUNITARIO',
  ];

  // Arreglos maestros cargados desde SQLite
  cursosDisponibles: any[] = [];
  equipamientosDisponibles: any[] = [];

  // Colecciones filtradas para renderizar las opciones de los selectores HTML
  localidadesSesion: string[] = [];
  cdcsSesion: string[] = [];
  tiposSesion: string[] = [];
  codigosSesion: string[] = [];

  // Rangos límites institucionales extraídos dinámicamente de la DB
  limitesHorarios = { apertura: '00:00', cierre: '23:59' };
  limitesFechasCurso = { inicio: '1970-01-01', fin: '2999-12-31' };

  constructor(
    private fb: FormBuilder,
    private equipamientoService: EquipamientoService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const idAutomatico = this.generarIdCursoUnico();

    // 1. Inicialización del Formulario del Curso (Nivel 1)
    this.cursoForm = this.fb.group(
      {
        idCurso: [{ value: idAutomatico, disabled: true }, Validators.required],
        nombreCurso: ['', Validators.required],
        componenteServicio: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        asistentes: [null, [Validators.required, Validators.min(1)]],
      },
      {
        validators: [this.validarRangoFechasCurso()],
      },
    );

    // 2. Inicialización del Formulario de la Sesión (Nivel 2)
    this.sesionForm = this.fb.group(
      {
        curso: ['', Validators.required],
        localidad: ['', Validators.required],
        cdc: [{ value: '', disabled: true }, Validators.required],
        tipoEquipamiento: [{ value: '', disabled: true }, Validators.required],
        equipamientoEnumerado: [{ value: '', disabled: true }, Validators.required],
        fechaSesion: ['', Validators.required],
        diaSemana: [{ value: '', disabled: true }, Validators.required],
        horaInicioUso: ['', Validators.required],
        horaFinUso: ['', Validators.required],
        estadoSesion: ['Programada', Validators.required],
        motivo: [{ value: '', disabled: true }],
        observaciones: [''],
      },
      {
        validators: [this.validarReglasSesion()],
      },
    );

    // 3. 💥 EJECUCIÓN OBLIGATORIA DE PROCESOS CRUCIALES 💥
    this.cargarSelectoresDesdeDB();
    this.activarEscuchasReactivasM2();

    if (!this.authService.canManageOcupacion()) {
      this.cursoForm.disable();
      this.sesionForm.disable();
    }
  }

  private generarIdCursoUnico(): string {
    return `CRS-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  private validarRangoFechasCurso(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inicio = control.get('fechaInicio')?.value;
      const fin = control.get('fechaFin')?.value;
      return inicio && fin && inicio > fin ? { fechasInconsistentes: true } : null;
    };
  }

  // Consulta asíncrona a la API Express/SQLite al renderizar la pestaña
  cargarSelectoresDesdeDB(): void {
    this.equipamientoService.obtenerCursosSelector().subscribe({
      next: (data) => {
        this.cursosDisponibles = data;
      },
      error: (e) => console.error('Error al traer cursos de SQLite:', e),
    });

    this.equipamientoService.obtenerEquipamientosSelector().subscribe({
      next: (data) => {
        this.equipamientosDisponibles = data;
        // Mapea y extrae valores únicos de localidades guardadas en M1
        this.localidadesSesion = [...new Set(data.map((e) => e.nombre_localidad))];
      },
      error: (e) => console.error('Error al traer equipamientos de SQLite:', e),
    });
  }

  // Orquestador reactivo de filtros encadenados en cascada real
  private activarEscuchasReactivasM2(): void {
    // Al seleccionar un Curso, memorizar sus fechas límites
    this.sesionForm.get('curso')?.valueChanges.subscribe((cursoId) => {
      if (cursoId) {
        const cursoElegido = this.cursosDisponibles.find((c) => c.id === +cursoId);
        if (cursoElegido) {
          this.limitesFechasCurso.inicio = cursoElegido.fecha_inicio;
          this.limitesFechasCurso.fin = cursoElegido.fecha_fin;
        }
      }
    });

    // CASCADA 1: Localidad ➔ CDC
    this.sesionForm.get('localidad')?.valueChanges.subscribe((loc) => {
      const cdcCtrl = this.sesionForm.get('cdc');
      cdcCtrl?.reset('');
      this.sesionForm.get('tipoEquipamiento')?.reset('');
      this.sesionForm.get('equipamientoEnumerado')?.reset('');
      this.cdcsSesion = [];

      if (loc) {
        const filtrados = this.equipamientosDisponibles.filter((e) => e.nombre_localidad === loc);
        this.cdcsSesion = [...new Set(filtrados.map((e) => e.nombre_cdc))];
        cdcCtrl?.enable();
      } else {
        cdcCtrl?.disable();
      }
    });

    // CASCADA 2: CDC ➔ Tipo Equipamiento
    this.sesionForm.get('cdc')?.valueChanges.subscribe((cdc) => {
      const tipoCtrl = this.sesionForm.get('tipoEquipamiento');
      tipoCtrl?.reset('');
      this.sesionForm.get('equipamientoEnumerado')?.reset('');
      this.tiposSesion = [];

      if (cdc) {
        const loc = this.sesionForm.get('localidad')?.value;
        const filtrados = this.equipamientosDisponibles.filter(
          (e) => e.nombre_localidad === loc && e.nombre_cdc === cdc,
        );
        this.tiposSesion = [...new Set(filtrados.map((e) => e.tipo))];
        tipoCtrl?.enable();
      } else {
        tipoCtrl?.disable();
      }
    });

    // CASCADA 3: Tipo Equipamiento ➔ Código Enumerado
    this.sesionForm.get('tipoEquipamiento')?.valueChanges.subscribe((tipo) => {
      const codCtrl = this.sesionForm.get('equipamientoEnumerado');
      codCtrl?.reset('');
      this.codigosSesion = [];

      if (tipo) {
        const loc = this.sesionForm.get('localidad')?.value;
        const cdc = this.sesionForm.get('cdc')?.value;
        // Sincroniza con la columna real 'codigo_enumerado' devuelta por la API
        const filtrados = this.equipamientosDisponibles.filter(
          (e) => e.nombre_localidad === loc && e.nombre_cdc === cdc && e.tipo === tipo,
        );
        this.codigosSesion = filtrados.map((e) => e.codigo_enumerado || e.codigo_enumerated);
        codCtrl?.enable();
      } else {
        codCtrl?.disable();
      }
    });

    // Fijar rangos de horas operativas basados en el equipamiento seleccionado
    this.sesionForm.get('equipamientoEnumerado')?.valueChanges.subscribe((codigo) => {
      if (codigo) {
        const eq = this.equipamientosDisponibles.find(
          (e) => e.codigo_enumerado === codigo || e.codigo_enumerated === codigo,
        );
        if (eq) {
          this.limitesHorarios.apertura = eq.hora_apertura || '00:00';
          this.limitesHorarios.cierre = eq.hora_cierre || '23:59';
        }
      }
    });

    // Algoritmo nativo para deducir y setear el Día de la semana en base a la fecha
    this.sesionForm.get('fechaSesion')?.valueChanges.subscribe((fechaValue) => {
      if (fechaValue) {
        const partes = fechaValue.split('-');
        const dateObj = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        const dSemana = new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(dateObj);
        const capitalizado = dSemana.charAt(0).toUpperCase() + dSemana.slice(1);
        this.sesionForm.get('diaSemana')?.setValue(capitalizado);
      } else {
        this.sesionForm.get('diaSemana')?.reset('');
      }
    });

    // Manejo condicional reactivo del campo Motivo
    this.sesionForm.get('estadoSesion')?.valueChanges.subscribe((estado) => {
      const motivoCtrl = this.sesionForm.get('motivo');
      const estadosConMotivo = ['Cancelado', 'No realizado', 'Fuera de servicio'];

      if (estadosConMotivo.includes(estado)) {
        motivoCtrl?.enable();
        motivoCtrl?.setValidators([Validators.required]);
      } else {
        motivoCtrl?.reset('');
        motivoCtrl?.disable();
        motivoCtrl?.clearValidators();
      }
      motivoCtrl?.updateValueAndValidity();
    });
  }

  private validarReglasSesion(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const fecha = group.get('fechaSesion')?.value;
      const inicioUso = group.get('horaInicioUso')?.value;
      const finUso = group.get('horaFinUso')?.value;
      const errors: any = {};

      if (
        fecha &&
        (fecha < this.limitesFechasCurso.inicio || fecha > this.limitesFechasCurso.fin)
      ) {
        errors['fechaFueraDeRangoCurso'] = true;
      }
      if (
        inicioUso &&
        (inicioUso < this.limitesHorarios.apertura || inicioUso > this.limitesHorarios.cierre)
      ) {
        errors['inicioFueraDeApertura'] = true;
      }
      if (inicioUso && finUso) {
        if (finUso <= inicioUso) errors['finMenorAlInicio'] = true;
        if (finUso > this.limitesHorarios.cierre) errors['finSobrepasaCierre'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  saveCurso(): void {
    if (this.cursoForm.valid) {
      const formVal = this.cursoForm.getRawValue();
      const payload = {
        nombre: formVal.nombreCurso,
        componente_servicio: formVal.componenteServicio,
        fecha_inicio: formVal.fechaInicio,
        fecha_fin: formVal.fechaFin,
        asistentes_estimados: formVal.asistentes,
      };
      this.equipamientoService.registrarCurso(payload).subscribe({
        next: () => {
          alert('Curso guardado con éxito.');
          this.cursoForm.reset();
          this.cursoForm.get('idCurso')?.setValue(this.generarIdCursoUnico());
          this.cargarSelectoresDesdeDB(); // Fuerza recarga inmediata en el selector de la sesión
        },
        error: (err) => console.error('Error al registrar curso:', err),
      });
    }
  }

  saveSesion(): void {
    if (this.sesionForm.valid) {
      const formRaw = this.sesionForm.getRawValue();
      const eqMapeado = this.equipamientosDisponibles.find(
        (e) =>
          e.codigo_enumerado === formRaw.equipamientoEnumerado ||
          e.codigo_enumerated === formRaw.equipamientoEnumerado,
      );

      const payload = {
        curso_id: +formRaw.curso,
        equipamiento_id: eqMapeado ? eqMapeado.id : 1,
        fecha_sesion: formRaw.fechaSesion,
        dia_semana: formRaw.diaSemana,
        hora_inicio: formRaw.horaInicioUso,
        hora_fin: formRaw.horaFinUso,
        asistentes_reales: 0,
        estado_sesion:
          formRaw.estadoSesion === 'Programada' || formRaw.estadoSesion === 'Realizada'
            ? formRaw.estadoSesion
            : 'Cancelada',
        motivo: formRaw.motivo || null,
        observaciones: formRaw.observaciones,
      };

            this.equipamientoService.registrarSesion(payload).subscribe({
        next: () => { 
          alert('Sesión vinculada y guardada con éxito.'); 
          
          // Restablecer el formulario al estado por defecto
          this.sesionForm.reset({ estadoSesion: 'Programada', motivo: '' }); 
          
          // Asegurar el bloqueo del select de motivos y cascadas para el siguiente registro
          this.sesionForm.get('cdc')?.disable();
          this.sesionForm.get('tipoEquipamiento')?.disable();
          this.sesionForm.get('equipamientoEnumerado')?.disable();
          this.sesionForm.get('diaSemana')?.disable();
          this.sesionForm.get('motivo')?.disable(); // 👈 Forzar bloqueo inicial
        },
        error: (err) => console.error('Error al registrar sesión:', err)
      });

    }
  }
}
