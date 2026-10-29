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
  FormArray,
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

  // Propiedad para almacenar dinámicamente la capacidad del equipamiento seleccionado
  capacidadMaximaAforo: number = 0;

  componentesServicioList = [
    'INCLUSION PRODUCTIVA',
    'INCLUSION SOCIAL',
    'PARTICIPATIVO Y COMUNITARIO',
  ];

  dbCentros: any = {
    'BARRIOS UNIDOS': {
      'CDC MARIA GORETTI': {
        AUDITORIO: ['AUDITORIO-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
        ],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        GIMNASIO: ['GIMNASIO-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
      },
    },
    BOSA: {
      'CDC PORVENIR': {
        'PISCINA PEQUEÑA': ['PISCINA PEQUEÑA-001'],
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
          'PISCINA GRANDE-CARRIL-06',
        ],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
        ],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        GIMNASIO: ['GIMNASIO-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
    },
    CHAPINERO: {
      'CDC TITOS GARZÓN': {
        'CANCHA MULTIPLE': ['CANCHA MULTIPLE-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
      },
    },
    'CIUDAD BOLIVAR': {
      'CDC ARBORIZADORA ALTA': {
        AUDITORIO: ['AUDITORIO-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
        ],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001', 'SALON DE CONFECCION-002'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
      'CDC ECOPARQUE': {
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
      },
    },
    ENGATIVA: {
      'CDC SANTA HELENITA': {
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
      },
    },
    FONTIBON: {
      'CDC LA GIRALDA': {
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
      },
    },
    KENNEDY: {
      'CDC BELLAVISTA': {
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
          'PISCINA GRANDE-CARRIL-06',
        ],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
          'SALON POLIVALENTE-005',
          'SALON POLIVALENTE-006',
        ],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        GIMNASIO: ['GIMNASIO-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
      'CDC KENNEDY': {
        CARPA: ['CARPA-001'],
        HUERTA: ['HUERTA-001', 'HUERTA-002'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001', 'SALON DE SISTEMAS-002'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
      'CDC TIMIZA': {
        AUDITORIO: ['AUDITORIO-001'],
        HUERTA: ['HUERTA-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'ZONAS VERDES': ['ZONAS VERDES-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
    },
    'LOS MARTIRES': {
      'CDC MARTIRES': {
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
      },
    },
    'PUENTE ARANDA': {
      'CDC JOSÉ ANTONIO GALAN': {
        'CANCHA DE TEJO': ['CANCHA DE TEJO-001'],
        HUERTA: ['HUERTA-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'ZONAS VERDES': ['ZONAS VERDES-001'],
      },
      'CDC ASUNCIÓN': {
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
        ],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001', 'SALON DE CONFECCION-002'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
      },
    },
    'RAFAEL URIBE URIBE': {
      'CDC SAMORE': {
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
        ],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
      },
      'CDC MOLINOS': {
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
        ],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
      },
      'CDC COLINAS': {
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
    },
    'SAN CRISTOBAL': {
      'CDC LA VICTORIA': {
        COLISEO: ['COLISEO-001'],
        TEATRO: ['TEATRO-001'],
        'CANCHA DE TEJO': ['CANCHA DE TEJO-001'],
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
          'PISCINA GRANDE-CARRIL-06',
        ],
        HUERTA: ['HUERTA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
          'SALON POLIVALENTE-005',
        ],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
      'CDC SAN BLAS': {
        HUERTA: ['HUERTA-001', 'HUERTA-002'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
        ],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        'SALON DE MUSICA': ['SALON DE MUSICA-001'],
      },
    },
    'SANTA FE': {
      'CDC LOURDES': {
        TEATRO: ['TEATRO-001'],
        COLISEO: ['COLISEO-001'],
        'CANCHA DE TEJO': ['CANCHA DE TEJO-001'],
        HUERTA: ['HUERTA-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
          'SALON POLIVALENTE-005',
          'SALON POLIVALENTE-006',
        ],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        GIMNASIO: ['GIMNASIO-001'],
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
        ],
        'ZONAS VERDES': ['ZONAS VERDES-001'],
      },
    },
    SUBA: {
      'CDC TIBABUYES': {
        TEATRO: ['TEATRO-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        PLAZOLETA: ['PLAZOLETA-001'],
      },
    },
    TUNJUELITO: {
      'CDC PABLO DE TARSO': {
        'SALON POLIVALENTE': ['SALON POLIVALENTE-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
      },
    },
    USAQUEN: {
      'CDC SIMON BOLIVAR': {
        COLISEO: ['COLISEO-001'],
        TEATRO: ['TEATRO-001'],
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
          'PISCINA GRANDE-CARRIL-06',
        ],
        'PISCINA PEQUEÑA': ['PISCINA PEQUEÑA-001'],
        HUERTA: ['HUERTA-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
          'SALON POLIVALENTE-004',
          'SALON POLIVALENTE-005',
          'SALON POLIVALENTE-006',
          'SALON POLIVALENTE-007',
        ],
        GIMNASIO: ['GIMNASIO-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001', 'SALON DE CONFECCION-002'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        PLAZOLETA: ['PLAZOLETA-001', 'PLAZOLETA-002'],
        'ZONAS VERDES': ['ZONAS VERDES-001'],
      },
    },
    USME: {
      'CDC JULIO CESAR SANCHEZ': {
        AUDITORIO: ['AUDITORIO-001'],
        HUERTA: ['HUERTA-001'],
        'LAVANDERIA COMUNITARIA': ['LAVANDERIA COMUNITARIA-001'],
        'SALON POLIVALENTE': [
          'SALON POLIVALENTE-001',
          'SALON POLIVALENTE-002',
          'SALON POLIVALENTE-003',
        ],
        GIMNASIO: ['GIMNASIO-001'],
        'SALON DE SISTEMAS': ['SALON DE SISTEMAS-001'],
        'SALON DE BELLEZA Y ESTETICA': ['SALON DE BELLEZA Y ESTETICA-001'],
        'SALON DE COCINA': ['SALON DE COCINA-001'],
        'SALON DE CONFECCION': ['SALON DE CONFECCION-001'],
        PLAZOLETA: [
          'PLAZOLETA-001',
          'PLAZOLETA-002',
          'PLAZOLETA-003',
          'PLAZOLETA-004',
          'PLAZOLETA-005',
        ],
        'PISCINA GRANDE': [
          'PISCINA GRANDE-CARRIL-01',
          'PISCINA GRANDE-CARRIL-02',
          'PISCINA GRANDE-CARRIL-03',
          'PISCINA GRANDE-CARRIL-04',
          'PISCINA GRANDE-CARRIL-05',
        ],
        'ZONAS VERDES': ['ZONAS VERDES-001'],
      },
    },
  };

  // 2. Extraer las llaves raíz del objeto para inicializar las localidades disponibles
  getLocalidadesLista(): string[] {
    return Object.keys(this.dbCentros);
  }

  // Arreglo maestro para rellenar la lista desplegable de sesiones (1 a 10)
  listaSesionesMax = Array.from({ length: 10 }, (_, i) => i + 1);

  // Arreglos maestros cargados desde SQLite
  cursosDisponibles: any[] = [];
  equipamientosDisponibles: any[] = [];

  // Colecciones filtradas maestras para la carga inicial
  localidadesSesion: string[] = [];

  // Almacenes dinámicos indexados por cada sesión [index] para mantener las cascadas independientes
  cdcsSesionPorIndex: { [key: number]: string[] } = {};
  tiposSesionPorIndex: { [key: number]: string[] } = {};
  codigosSesionPorIndex: { [key: number]: any[] } = {};

  // Rangos límites institucionales por cada sesión individual del acordeón
  limitesHorariosPorIndex: { [key: number]: { apertura: string; cierre: string } } = {};
  limitesFechasCurso = { inicio: '1970-01-01', fin: '2999-12-31' };

  constructor(
    private fb: FormBuilder,
    private equipamientoService: EquipamientoService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const idAutomatico = this.generarIdCursoUnico();

    // 1. Inicialización Centralizada del Formulario del Curso (Nivel 1)
    this.cursoForm = this.fb.group(
      {
        idCurso: [{ value: idAutomatico, disabled: true }, Validators.required],
        nombreCurso: ['', Validators.required],
        componenteServicio: ['', Validators.required],
        cantidadSesiones: ['', Validators.required], // Control del Acordeón
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        asistentes: [null, [Validators.required, Validators.min(1)]],
        sesiones: this.fb.array([]), // FormArray dinámico para el Nivel 2
      },
      {
        validators: [this.validarRangoFechasCurso(), this.validarAforoCurso()],
      },
    );

    // 2. 💥 EJECUCIÓN OBLIGATORIA DE PROCESOS CRUCIALES 💥
    this.cargarSelectoresDesdeDB();
    this.activarEscuchasCantidadSesiones();

    if (!this.authService.canManageOcupacion()) {
      this.cursoForm.disable();
    }
  }

  // Getter de conveniencia para acceder de forma rápida al FormArray en el HTML
  get sesionesFormArray(): FormArray {
    return this.cursoForm.get('sesiones') as FormArray;
  }

  // Estructura de Inicialización Individual de un Subformulario de Sesión
  private crearSubFormSesion(numeroSesion: number): FormGroup {
    const index = numeroSesion - 1;

    // Inicializar límites por defecto para este índice
    this.limitesHorariosPorIndex[index] = { apertura: '00:00', cierre: '23:59' };

    const group = this.fb.group(
      {
        numeroSesion: [numeroSesion],
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
        validators: [this.validarReglasSesionPorIndex(index)],
      },
    );

    // Adjuntar escuchas de eventos internos de cascada reactiva para este índice específico
    this.registrarEscuchasInternasSesion(group, index);

    return group;
  }

  // Manejador reactivo para agregar o remover subformularios basados en la selección (1-10)
  private activarEscuchasCantidadSesiones(): void {
    this.cursoForm.get('cantidadSesiones')?.valueChanges.subscribe((cantidadStr) => {
      const cantidad = parseInt(cantidadStr, 10) || 0;
      const currentLength = this.sesionesFormArray.length;

      if (cantidad > currentLength) {
        for (let i = currentLength; i < cantidad; i++) {
          this.sesionesFormArray.push(this.crearSubFormSesion(i + 1));
        }
      } else if (cantidad < currentLength) {
        for (let i = currentLength - 1; i >= cantidad; i--) {
          this.sesionesFormArray.removeAt(i);
          // Limpiar colecciones de la sesión destruida para evitar fugas de memoria
          delete this.cdcsSesionPorIndex[i];
          delete this.tiposSesionPorIndex[i];
          delete this.codigosSesionPorIndex[i];
          delete this.limitesHorariosPorIndex[i];
        }
      }
    });
  }

  // =========================================================================
  // LOGICA REACTIVA DE CASCADAS Y REGLAS ENCAPSULADAS POR ÍNDICE DEL ACORDEÓN
  // =========================================================================
  private registrarEscuchasInternasSesion(group: FormGroup, index: number): void {
    // CASCADA 1: Localidad ➔ CDC
    group.get('localidad')?.valueChanges.subscribe((loc) => {
      const cdcCtrl = group.get('cdc');
      cdcCtrl?.reset('');
      group.get('tipoEquipamiento')?.reset('');
      group.get('equipamientoEnumerado')?.reset('');
      this.cdcsSesionPorIndex[index] = [];

      if (loc) {
        const filtrados = this.equipamientosDisponibles.filter((e) => e.nombre_localidad === loc);
        this.cdcsSesionPorIndex[index] = [...new Set(filtrados.map((e) => e.nombre_cdc))];
        cdcCtrl?.enable({ emitEvent: false });
      } else {
        cdcCtrl?.disable({ emitEvent: false });
      }
    });

    // CASCADA 2: CDC ➔ Tipo Equipamiento
    group.get('cdc')?.valueChanges.subscribe((cdc) => {
      const tipoCtrl = group.get('tipoEquipamiento');
      tipoCtrl?.reset('');
      group.get('equipamientoEnumerado')?.reset('');
      this.tiposSesionPorIndex[index] = [];

      if (cdc) {
        const loc = group.get('localidad')?.value;
        const filtrados = this.equipamientosDisponibles.filter(
          (e) => e.nombre_localidad === loc && e.nombre_cdc === cdc,
        );
        this.tiposSesionPorIndex[index] = [...new Set(filtrados.map((e) => e.tipo))];
        tipoCtrl?.enable({ emitEvent: false });
      } else {
        tipoCtrl?.disable({ emitEvent: false });
      }
    });

    // CASCADA 3: Tipo Equipamiento ➔ Código Enumerado
    group.get('tipoEquipamiento')?.valueChanges.subscribe((tipo) => {
      const codCtrl = group.get('equipamientoEnumerado');
      codCtrl?.reset('');
      this.codigosSesionPorIndex[index] = [];

      if (tipo) {
        const loc = group.get('localidad')?.value;
        const cdc = group.get('cdc')?.value;
        const filtrados = this.equipamientosDisponibles.filter(
          (e) => e.nombre_localidad === loc && e.nombre_cdc === cdc && e.tipo === tipo,
        );
        this.codigosSesionPorIndex[index] = filtrados;
        codCtrl?.enable({ emitEvent: false });
      } else {
        codCtrl?.disable({ emitEvent: false });
      }
    });

    // Capturar Aforo y configurar rangos operativos basados en el código definitivo seleccionado
    group.get('equipamientoEnumerado')?.valueChanges.subscribe((codigo) => {
      if (codigo) {
        const eq = this.equipamientosDisponibles.find(
          (e) => e.codigo_enumerado === codigo || e.codigo_enumerated === codigo,
        );
        if (eq) {
          // Guardar límites horarios de forma aislada para este índice
          this.limitesHorariosPorIndex[index] = {
            apertura: eq.hora_apertura || '00:00',
            cierre: eq.hora_cierre || '23:59',
          };
          this.capacidadMaximaAforo = eq.capacidad || 0;
        }
      } else {
        this.limitesHorariosPorIndex[index] = { apertura: '00:00', cierre: '23:59' };
        this.capacidadMaximaAforo = 0;
      }
      // Re-evaluar inmediatamente las validaciones del Nivel: Curso
      this.cursoForm.get('asistentes')?.updateValueAndValidity();
    });

    // Algoritmo nativo para deducir y setear el Día de la semana en base a la fecha de la sesión
    group.get('fechaSesion')?.valueChanges.subscribe((fechaValue) => {
      if (fechaValue) {
        const partes = fechaValue.split('-');
        const dateObj = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        const dSemana = new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(dateObj);
        const capitalizado = dSemana.charAt(0).toUpperCase() + dSemana.slice(1);
        group.get('diaSemana')?.setValue(capitalizado);
      } else {
        group.get('diaSemana')?.reset('');
      }
    });

    // Manejo condicional reactivo del campo Motivo de Cierre/Cancelación
    group.get('estadoSesion')?.valueChanges.subscribe((estado) => {
      const motivoCtrl = group.get('motivo');
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

  // ==========================================
  // FILTROS EN CASCADA REAL VÍA SQLITE (M2)
  // ==========================================

  onLocalidadSesionChange(index: number): void {
    const group = this.sesionesFormArray.at(index) as FormGroup;
    const loc = group.get('localidad')?.value;

    group.get('cdc')?.reset('');
    group.get('tipoEquipamiento')?.reset('');
    group.get('equipamientoEnumerado')?.reset('');
    group.get('cdc')?.disable();
    group.get('tipoEquipamiento')?.disable();
    group.get('equipamientoEnumerado')?.disable();

    this.cdcsSesionPorIndex[index] = [];
    this.tiposSesionPorIndex[index] = [];
    this.codigosSesionPorIndex[index] = [];

    if (loc && this.dbCentros[loc]) {
      this.cdcsSesionPorIndex[index] = Object.keys(this.dbCentros[loc]);
      group.get('cdc')?.enable();
    }
  }

  onCdcSesionChange(index: number): void {
    const group = this.sesionesFormArray.at(index) as FormGroup;
    const loc = group.get('localidad')?.value;
    const cdc = group.get('cdc')?.value;

    group.get('tipoEquipamiento')?.reset('');
    group.get('equipamientoEnumerado')?.reset('');
    group.get('tipoEquipamiento')?.disable();
    group.get('equipamientoEnumerado')?.disable();

    this.tiposSesionPorIndex[index] = [];
    this.codigosSesionPorIndex[index] = [];

    if (loc && cdc && this.dbCentros[loc] && this.dbCentros[loc][cdc]) {
      this.tiposSesionPorIndex[index] = Object.keys(this.dbCentros[loc][cdc]);
      group.get('tipoEquipamiento')?.enable();
    }
  }

  onTipoSesionChange(index: number): void {
    const group = this.sesionesFormArray.at(index) as FormGroup;
    const loc = group.get('localidad')?.value;
    const cdc = group.get('cdc')?.value;
    const tipo = group.get('tipoEquipamiento')?.value;
    group.get('equipamientoEnumerado')?.reset('');
    group.get('equipamientoEnumerado')?.disable();
    this.codigosSesionPorIndex[index] = [];

    if (
      loc &&
      cdc &&
      tipo &&
      this.dbCentros[loc] &&
      this.dbCentros[loc][cdc] &&
      this.dbCentros[loc][cdc][tipo]
    ) {
      // Guarda la lista de strings del equipamiento enumerado (ej: ['SALON POLIVALENTE-001', 'SALON POLIVALENTE-002'])
      this.codigosSesionPorIndex[index] = this.dbCentros[loc][cdc][tipo];
      group.get('equipamientoEnumerado')?.enable();
    }
  }

  // ==========================================
  // VALIDADORES PERSONALIZADOS REACIVOS
  // ==========================================
  private validarAforoCurso(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const asistentesCtrl = formGroup.get('asistentes');
      if (!asistentesCtrl || !asistentesCtrl.value) return null;

      const cantidadAsistentes = asistentesCtrl.value;

      if (this.capacidadMaximaAforo > 0 && cantidadAsistentes > this.capacidadMaximaAforo) {
        asistentesCtrl.setErrors({ ...asistentesCtrl.errors, superaAforo: true });
        return { superaAforo: true };
      } else {
        if (asistentesCtrl.errors) {
          const { superaAforo, ...demasErrores } = asistentesCtrl.errors;
          asistentesCtrl.setErrors(Object.keys(demasErrores).length ? demasErrores : null);
        }
        return null;
      }
    };
  }

  private validarRangoFechasCurso(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inicio = control.get('fechaInicio')?.value;
      const fin = control.get('fechaFin')?.value;
      if (inicio && fin && inicio > fin) {
        return { fechasInconsistentes: true };
      }
      return null;
    };
  }

  private validarReglasSesionPorIndex(index: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const fecha = group.get('fechaSesion')?.value;
      const inicioUso = group.get('horaInicioUso')?.value;
      const finUso = group.get('horaFinUso')?.value;
      const errors: any = {};

      const limitesHorarios = this.limitesHorariosPorIndex[index] || {
        apertura: '00:00',
        cierre: '23:59',
      };

      if (
        fecha &&
        (fecha < this.limitesFechasCurso.inicio || fecha > this.limitesFechasCurso.fin)
      ) {
        errors['fechaFueraDeRangoCurso'] = true;
      }
      if (
        inicioUso &&
        (inicioUso < limitesHorarios.apertura || inicioUso > limitesHorarios.cierre)
      ) {
        errors['inicioFueraDeApertura'] = true;
      }
      if (inicioUso && finUso) {
        if (finUso <= inicioUso) errors['finMenorAlInicio'] = true;
        if (finUso > limitesHorarios.cierre) errors['finSobrepasaCierre'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  // ==========================================
  // CONSULTAS ASÍNCRONAS REACTIVAS DE LA DB
  // ==========================================

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
        this.localidadesSesion = [...new Set(data.map((e) => e.nombre_localidad))];
      },
      error: (e) => console.error('Error al traer equipamientos de SQLite:', e),
    });
  }

  private generarIdCursoUnico(): string {
    return `CRS-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Guardado Integrado del Formulario Completo (Curso + N Sesiones del FormArray)
  saveCurso(): void {
    if (this.cursoForm.valid) {
      const formVal = this.cursoForm.getRawValue();

      const payload = {
        nombre: formVal.nombreCurso,
        componente_servicio: formVal.componenteServicio,
        fecha_inicio: formVal.fechaInicio,
        fecha_fin: formVal.fechaFin,
        asistentes_estimados: formVal.asistentes,
        // Mapeamos el arreglo de sesiones para mandarlo consolidado al backend
        sesiones_asociadas: formVal.sesiones.map((s: any) => ({
          fecha_sesion: s.fechaSesion,
          dia_semana: s.diaSemana,
          hora_inicio: s.horaInicioUso,
          hora_fin: s.horaFinUso,
          estado_sesion: s.estadoSesion,
          motivo: s.motivo || null,
          observaciones: s.observaciones,
          equipamiento_codigo: s.equipamientoEnumerado,
        })),
      };

      this.equipamientoService.registrarCurso(payload).subscribe({
        next: () => {
          alert('Curso y sus Sesiones guardados de manera unificada con éxito.');
          this.cursoForm.reset();
          this.sesionesFormArray.clear(); // Limpia el acordeón visual
          this.cursoForm.get('idCurso')?.setValue(this.generarIdCursoUnico());
          this.cargarSelectoresDesdeDB();
        },
        error: (err) => console.error('Error al registrar curso consolidado:', err),
      });
    }
  }
}
