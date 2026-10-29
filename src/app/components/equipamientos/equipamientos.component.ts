import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { EquipamientoService } from '../../services/equipamiento.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-equipamientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipamientos.component.html',
})
export class EquipamientosComponent implements OnInit {
  equipmentForm!: FormGroup;
  diasSemanaList = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
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

  dbOcupaciones: { [key: string]: string[] } = {
    'SUBDIRECCIÓN PARA LA INFANCIA': [
      'SERVICIO JARDINES INFANTILES DIURNOS',
      'SERVICIO CRECIENDO JUNTOS',
      'SERVICIO CENTRO AMAR',
      'SERVICIO CIUDAD NIÑEZ',
      'SERVICIO EL ARTE DE CUIDAR-TE',
      'SERVICIO ATRAPASUEÑOS',
      'SERVICIO CENTRO ABRAZAR',
    ],
    'SUBDIRECCIÓN PARA LA JUVENTUD': [
      'SERVICIO FORJAR RESTAURATIVO',
      'SERVICIO CASAS DE JUVENTUD',
      'SERVICIO JÓVENES CON OPORTUNIDADES',
    ],
    'SUBDIRECCIÓN PARA LA ADULTEZ': [
      'SERVICIO MÓVIL DE ABORDAJE TERRITORIAL Y PREVENCIÓN DEL FENÓMENO DE HABITABILIDAD EN CALLE',
      'SERVICIO DE AUTOCUIDADO PARA POBLACIÓN HABITANTE DE CALLE',
      'SERVICIO DE HOGAR DE PASO DÍA Y HOGAR DE PASO NOCHE PARA LA ATENCIÓN DE POBLACIÓN HABITANTE DE CALLE',
      'SERVICIO PREVENCIÓN DEL RIESGO DE HABITAR CALLE',
      'SERVICIO ATENCIÓN Y DESARROLLO DE CAPACIDADES PARA MUJERES HABITANTES DE CALLE',
      'SERVICIO ATENCIÓN SOCIOSANITARIA PARA POBLACIÓN HABITANTE DE CALLE Y EN ALTO RIESGO DE ESTARLO',
      'SERVICIO COMUNIDAD DE VIDA PARA POBLACIÓN HABITANTE DE CALLE',
      'SERVICIO ALTA DEPENDENCIA FÍSICA, MENTAL O COGNITIVA PARA POBLACIÓN HABITANTE DE CALLE',
      'SERVICIO CENTRO DE ACOGIDA PARA PERSONAS HABITANTES DE CALLE',
      'SERVICIO HOSPEDAJE SOCIAL',
      'SERVICIO COMUNIDAD DE CUIDADO PARA POBLACIÓN HABITANTE DE CALLE Y EN RIESGO DE ESTARLO',
      'SERVICIO DE INCLUSIÓN',
    ],
    'SUBDIRECCIÓN PARA LA VEJEZ': [
      'SERVICIO CUIDADO TRANSITORIO DÍA - NOCHE',
      'SERVICIO CENTRO DÍA A TU CASA',
      'SERVICIO COMUNIDAD DE CUIDADO',
      'SERVICIO CENTRO DÍA CASA DE LA SABIDURÍA',
      'SERVICIO BOGOTÁ TE ACOMPAÑA EN LA VEJEZ',
      'APOYO ECONÓMICO COFINANCIADO TIPO D - PROGRAMA COLOMBIA MAYOR',
      'SERVICIO ATENCIÓN SOCIOSANITARIA TRANSITORIA',
      'SERVICIO RESIDENCIAS DE ATENCIÓN INTEGRAL PARA PERSONAS MAYORES',
    ],
    'SUBDIRECCIÓN PARA ASUNTOS LGBTI': [
      'SERVICIO CASAS LGBTI',
      'SERVICIO REAFÍRMATE EL CHUCHÚ DE LA CÉDULA',
      'SERVICIO UNIDAD CONTRA LA DISCRIMINACIÓN',
    ],
    'SUBDIRECCIÓN PARA LA DISCAPACIDAD': [
      'SERVICIO CENTROS CRECER',
      'SERVICIO CENTROS INTEGRARTE ATENCIÓN INTERNA',
      'SERVICIO CENTROS INTEGRARTE ATENCIÓN EXTERNA',
      'SERVICIO CENTRO DISTRITAL DE REFERENCIACIÓN Y APOYO INTEGRAL PARA LA INCLUSIÓN SOCIAL - CADIS+',
      'SERVICIO VALORACIÓN DE APOYOS PARA PERSONAS CON DISCAPACIDAD',
    ],
    'SUBDIRECCIÓN PARA LA FAMILIA': [
      'SERVICIO CENTROS PROTEGER',
      'SERVICIO DE ACCESO A LA JUSTICIA - COMISARÍAS DE FAMILIA',
    ],
    'SUBDIRECCIÓN PARA LA GESTIÓN INTEGRAL LOCAL': [
      'SERVICIO CENTRO DE OPORTUNIDADES Y CAPACIDADES',
      'SERVICIO CONEXIÓN SOCIAL',
    ],
    'SUBDIRECCIÓN PARA LA IDENTIFICACIÓN, CARACTERIZACIÓN E INTEGRACIÓN': [
      'SERVICIO GESTIÓN DEL RIESGO',
      'SERVICIO ATENCIÓN Y ASISTENCIA A HOGARES O PERSONAS EN ENERGENCIA SOCIAL',
    ],
    'MITIGACIÓN DE LA INSEGURIDAD ALIMENTARIA Y NUTRICIONAL': [
      'SERVICIO COMEDORES COMUNITARIOS',
      'SERVICIO COMPROMISO POR UNA ALIMENTACIÓN INCLUYENTE',
    ],
    'TRANSFERENCIAS MONETARIAS': [
      'TRANSFERENCIAS PARA PERSONAS CON DISCAPACIDAD',
      'TRANSFERENCIAS MONETARIAS NO CONDICIONADAS',
      'TRANSFERENCIAS MONETARIAS PARA PERSONA MAYOR',
      'TRANSFERENCIA PASAJES GRATIS',
      'TRANSFERENCIAS MONETARIAS PARA HOGARES ÉTNICOS VÍCTIMAS DEL CONFLICTO ARMADO',
      'TRANSFERENCIAS MONETARIAS CONDICIONADAS PARA LA PRIMERA INFANCIA',
      'TRANSFERENCIAS MONETARIAS CONDICIONADAS PARA EDUCACIÓN',
    ],
    'SECRETARÍA GENERAL DE LA ALCALDÍA MAYOR DE BOGOTÁ': [
      'SECRETARÍA GENERAL DE LA ALCALDÍA MAYOR DE BOGOTÁ',
    ],
    'SECRETARÍA JURÍDICA DISTRITAL': ['SECRETARÍA JURÍDICA DISTRITAL'],
    'SECRETARÍA DISTRITAL DE GOBIERNO': ['SECRETARÍA DISTRITAL DE GOBIERNO'],
    'SECRETARÍA DISTRITAL DE PLANEACIÓN': ['SECRETARÍA DISTRITAL DE PLANEACIÓN'],
    'SECRETARÍA DISTRITAL DE HACIENDA': ['SECRETARÍA DISTRITAL DE HACIENDA'],
    'SECRETARÍA DISTRITAL DE DESARROLLO ECONÓMICO': [
      'SECRETARÍA DISTRITAL DE DESARROLLO ECONÓMICO',
    ],
    'SECRETARÍA DE EDUCACIÓN DEL DISTRITO': ['SECRETARÍA DE EDUCACIÓN DEL DISTRITO'],
    'SECRETARÍA DISTRITAL DE SALUD': ['SECRETARÍA DISTRITAL DE SALUD'],
    'SECRETARÍA DISTRITAL DE CULTURA, RECREACIÓN Y DEPORTE': [
      'SECRETARÍA DISTRITAL DE CULTURA, RECREACIÓN Y DEPORTE',
    ],
    'SECRETARÍA DISTRITAL DE AMBIENTE': ['SECRETARÍA DISTRITAL DE AMBIENTE'],
    'SECRETARÍA DISTRITAL DE MOVILIDAD': ['SECRETARÍA DISTRITAL DE MOVILIDAD'],
    'SECRETARÍA DISTRITAL DE HÁBITAT': ['SECRETARÍA DISTRITAL DE HÁBITAT'],
    'SECRETARÍA DISTRITAL DE LA MUJER': ['SECRETARÍA DISTRITAL DE LA MUJER'],
    'SECRETARÍA DISTRITAL DE SEGURIDAD, CONVIVENCIA Y JUSTICIA': [
      'SECRETARÍA DISTRITAL DE SEGURIDAD, CONVIVENCIA Y JUSTICIA',
    ],
  };

  motivoCierreList = [
    'ADECUACION',
    'MANTENIMIENTO',
    'DOTACION',
    'ARCHIVO',
    'TALENTO HUMANO',
    'USO BODEGA',
  ];

  constructor(
    private fb: FormBuilder,
    private equipamientoService: EquipamientoService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    // 1. Obtener la fecha actual local en formato YYYY-MM-DD
    const hoy = new Date();
    const anio = hoy.getFullYear();
    // Se agrega un cero a la izquierda si el mes o día es menor a 10
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaActualStr = `${anio}-${mes}-${dia}`;

    this.equipmentForm = this.fb.group(
      {
        localidad: ['', Validators.required],
        cdc: [{ value: '', disabled: true }, Validators.required],
        tipoEquipamiento: [{ value: '', disabled: true }, Validators.required],
        equipamientoEnumerado: [{ value: '', disabled: true }, Validators.required],
        ocupacionSubdireccion: ['', Validators.required],
        ocupacionServicio: [{ value: '', disabled: true }, Validators.required],
        usoEquipamiento: ['', Validators.required],
        estado: ['ABIERTO', Validators.required],
        motivoCierre: [{ value: '', disabled: true }],
        capacidad: [null, [Validators.required, Validators.min(1)]],
        diasDisponibles: this.fb.array([]),
        horaApertura: [{ value: '', disabled: true }],
        horaCierre: [{ value: '', disabled: true }],
        observaciones: [''],
        fechaVigencia: [{ value: fechaActualStr, disabled: true }, Validators.required],
      },
      {
        validators: [this.validarHorariosDisponibles()], // 👈 Validador personalizado de tiempo y checklist
      },
    );

    this.initChecklistDias();
    this.escucharCambiosEstado();

    this.escucharCambiosDias();

    if (!this.authService.canManageEquipments()) {
      this.equipmentForm.disable();
    }
  }

  private initChecklistDias(): void {
    this.diasSemanaList.forEach(() => this.diasDisponiblesFormArray.push(new FormControl(false)));
  }

  get diasDisponiblesFormArray(): FormArray {
    return this.equipmentForm.get('diasDisponibles') as FormArray;
  }

  // 👈 VALIDADOR PERSONALIZADO: Horarios Obligatorios y Coherentes en función del Checklist
  private validarHorariosDisponibles(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const diasArray = formGroup.get('diasDisponibles') as FormArray;
      const horaApertura = formGroup.get('horaApertura')?.value;
      const horaCierre = formGroup.get('horaCierre')?.value;

      // Verificar si hay al menos un día marcado como 'true'
      const tieneDiasHabilitados = diasArray
        ? diasArray.controls.some((ctrl) => ctrl.value === true)
        : false;

      if (tieneDiasHabilitados) {
        const errors: any = {};

        // 1. Validar Obligatoriedad de Apertura
        if (!horaApertura) {
          errors['aperturaRequerida'] = true;
        }

        // 2. Validar Obligatoriedad de Cierre
        if (!horaCierre) {
          errors['cierreRequerido'] = true;
        }

        // 3. Validar que el Cierre sea Posterior a la Apertura
        if (horaApertura && horaCierre) {
          if (horaCierre <= horaApertura) {
            errors['cierreInvalido'] = true;
          }
        }

        return Object.keys(errors).length > 0 ? errors : null;
      }

      return null;
    };
  }

  private escucharCambiosEstado(): void {
    this.equipmentForm.get('estado')?.valueChanges.subscribe((estadoValue) => {
      const motivoCtrl = this.equipmentForm.get('motivoCierre');
      if (estadoValue === 'CERRADO') {
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

  private escucharCambiosDias(): void {
    this.diasDisponiblesFormArray.valueChanges.subscribe((valoresDias: boolean[]) => {
      // Si la gestión global está bloqueada por permisos, no hacemos nada
      if (!this.authService.canManageEquipments()) return;

      const horaAperturaCtrl = this.equipmentForm.get('horaApertura');
      const horaCierreCtrl = this.equipmentForm.get('horaCierre');

      // Verificar si al menos un checkbox está en 'true'
      const tieneDiasSeleccionados = valoresDias.some((val) => val === true);

      if (tieneDiasSeleccionados) {
        // Habilitar los campos si hay días seleccionados
        horaAperturaCtrl?.enable({ emitEvent: false });
        horaCierreCtrl?.enable({ emitEvent: false });
      } else {
        // Si no hay días, se limpian los valores y se vuelven a bloquear
        horaAperturaCtrl?.setValue('', { emitEvent: false });
        horaAperturaCtrl?.disable({ emitEvent: false });

        horaCierreCtrl?.setValue('', { emitEvent: false });
        horaCierreCtrl?.disable({ emitEvent: false });
      }
    });
  }

  getLocalidades() {
    return Object.keys(this.dbCentros);
  }
  getCDCs() {
    return this.equipmentForm.get('localidad')?.value
      ? Object.keys(this.dbCentros[this.equipmentForm.get('localidad')?.value])
      : [];
  }
  getTipos() {
    const loc = this.equipmentForm.get('localidad')?.value;
    const cdc = this.equipmentForm.get('cdc')?.value;
    return loc && cdc ? Object.keys(this.dbCentros[loc][cdc]) : [];
  }
  getCodigos() {
    const loc = this.equipmentForm.get('localidad')?.value;
    const cdc = this.equipmentForm.get('cdc')?.value;
    const tipo = this.equipmentForm.get('tipoEquipamiento')?.value;
    return loc && cdc && tipo ? this.dbCentros[loc][cdc][tipo] : [];
  }

  onLocalidadChange() {
    this.equipmentForm.get('cdc')?.enable();
    this.equipmentForm.get('cdc')?.reset('');
  }
  onCdcChange() {
    this.equipmentForm.get('tipoEquipamiento')?.enable();
    this.equipmentForm.get('tipoEquipamiento')?.reset('');
  }
  onTipoChange() {
    // 1. Habilitar y resetear el siguiente selector en cascada (tu lógica existente)
    this.equipmentForm.get('equipamientoEnumerado')?.enable();
    this.equipmentForm.get('equipamientoEnumerado')?.reset('');

    // 2. Obtener el tipo de equipamiento recién seleccionado
    const tipoSeleccionado = this.equipmentForm.get('tipoEquipamiento')?.value;

    // Si no han seleccionado nada (opción por defecto "Seleccione tipo..."), habilitamos y limpiamos el uso
    if (!tipoSeleccionado) {
      this.equipmentForm.get('usoEquipamiento')?.enable();
      this.equipmentForm.get('usoEquipamiento')?.setValue('');
      return;
    }

    // 3. Listado de equipamientos que requieren uso ESPECIALIZADO
    const tiposEspecializados = [
      'SALON DE CONFECCION',
      'SALON DE SISTEMAS',
      'SALON DE COCINA',
      'SALON DE BELLEZA Y ESTETICA',
      'GIMNASIO',
      'SALON DE MUSICA',
    ];

    const usoCtrl = this.equipmentForm.get('usoEquipamiento');

    // 4. Evaluar y asignar de forma automática según la lista
    if (tiposEspecializados.includes(tipoSeleccionado)) {
      usoCtrl?.setValue('ESPECIALIZADO');
    } else {
      // CAMBIO AQUÍ: Si es cualquier otro equipamiento, se marca automáticamente como NO ESPECIALIZADO
      usoCtrl?.setValue('NO ESPECIALIZADO');
    }

    // 5. Bloquear el campo en ambos casos para que el usuario no pueda alterarlo
    usoCtrl?.disable();
  }

  // 3. Métodos auxiliares para obtener las llaves y manejar los cambios reactivos
  getSubdirecciones() {
    return Object.keys(this.dbOcupaciones);
  }

  getServicios() {
    const subdireccion = this.equipmentForm.get('ocupacionSubdireccion')?.value;
    return subdireccion ? this.dbOcupaciones[subdireccion] : [];
  }

  onSubdireccionChange() {
    this.equipmentForm.get('ocupacionServicio')?.enable();
    this.equipmentForm.get('ocupacionServicio')?.reset('');
  }

  saveEquipment(): void {
    if (this.equipmentForm.valid) {
      const checkedDias = this.equipmentForm.value.diasDisponibles;
      const tieneDias = checkedDias.some((val: boolean) => val === true);

      if (!tieneDias) {
        alert('Debe marcar al menos un día disponible en el checklist.');
        return;
      }

      const diasSeleccionados = checkedDias
        .map((checked: boolean, i: number) => (checked ? this.diasSemanaList[i] : null))
        .filter((v: string | null) => v !== null)
        .join(', ');

      // 1. Obtener todos los valores del formulario
      const formVal = this.equipmentForm.getRawValue();

      // 2. 💥 ELIMINACIÓN Y MAPEO EXPLICITO: Estructuramos el JSON únicamente
      // con las columnas que el modelo de la base de datos SQLite reconoce.
      const payload = {
        tipo: formVal.tipoEquipamiento,
        codigo_enumerated: formVal.equipamientoEnumerado,
        ocupacion_servicio: formVal.ocupacionServicio,
        ocupacion_subdireccion: formVal.ocupacionSubdireccion,
        uso_equipamiento: formVal.usoEquipamiento,
        estado: formVal.estado,
        motivo_cierre: formVal.motivoCierre || null,
        capacidad: formVal.capacidad,
        dias_disponibles: diasSeleccionados,
        hora_apertura: formVal.horaApertura,
        hora_cierre: formVal.horaCierre,
        observaciones: formVal.observaciones,
        fecha_vigencia: formVal.fechaVigencia,
        usuario: this.authService.usuarioActual?.username,
        cdc_id: 1,
        localidad: formVal.localidad,
        cdc: formVal.cdc,
      };

      // 3. Imprime el payload en tu consola para que verifiques que NO lleva la palabra 'Localidad'
      console.log('Payload depurado enviado a la API:', payload);

      // 4. Consumir el servicio
      this.equipamientoService.registrarEquipamiento(payload).subscribe({
        next: () => {
          alert('Equipamiento guardado con éxito.');
          this.equipmentForm.reset({ estado: 'ABIERTO' });
          this.equipmentForm.get('cdc')?.disable();
          this.equipmentForm.get('tipoEquipamiento')?.disable();
          this.equipmentForm.get('equipamientoEnumerado')?.disable();
        },
        error: (err) => console.error('Error al persistir equipamiento:', err),
      });
    }
  }
}
