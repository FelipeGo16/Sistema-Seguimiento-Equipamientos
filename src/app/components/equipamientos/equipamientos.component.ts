import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
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
} from "@angular/forms";
import { EquipamientoService } from "../../services/equipamiento.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-equipamientos",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./equipamientos.component.html",
})
export class EquipamientosComponent implements OnInit {
  equipmentForm!: FormGroup;
  diasSemanaList = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  dbCentros: any = {
    "BARRIOS UNIDOS": {
      "CDC MARIA GORETTI": {
        AUDITORIO: ["AUDITORIO-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
        ],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        GIMNASIO: ["GIMNASIO-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
      },
    },
    BOSA: {
      "CDC PORVENIR": {
        "PISCINA PEQUEÑA": ["PISCINA PEQUEÑA-001"],
        "PISCINA GRANDE": ["PISCINA GRANDE-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
        ],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        GIMNASIO: ["GIMNASIO-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
    },
    CHAPINERO: {
      "CDC TITOS GARZÓN": {
        "CANCHA MULTIPLE": ["CANCHA MULTIPLE-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
      },
    },
    "CIUDAD BOLIVAR": {
      "CDC ARBORIZADORA ALTA": {
        AUDITORIO: ["AUDITORIO-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-008",
        ],
        "SALON DE CONFECCION": [
          "SALON DE CONFECCION-001",
          "SALON DE CONFECCION-002",
        ],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
      "CDC ECOPARQUE": {
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-005"],
      },
    },
    ENGATIVA: {
      "CDC SANTA HELENITA": {
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-002"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
      },
    },
    FONTIBON: {
      "CDC LA GIRALDA": {
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-002"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
      },
    },
    KENNEDY: {
      "CDC BELLAVISTA": {
        "PISCINA GRANDE": ["PISCINA GRANDE-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
          "SALON POLIVALENTE-005",
          "SALON POLIVALENTE-006",
        ],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        GIMNASIO: ["GIMNASIO-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
      "CDC KENNEDY": {
        CARPA: ["CARPA-001"],
        HUERTA: ["HUERTA-001", "HUERTA-002"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001", "SALON DE SISTEMAS-002"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
      "CDC TIMIZA": {
        AUDITORIO: ["AUDITORIO-001"],
        HUERTA: ["HUERTA-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": ["SALON POLIVALENTE-002", "SALON POLIVALENTE-003"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "ZONAS VERDES": ["ZONAS VERDES-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
    },
    "LOS MARTIRES": {
      "CDC MARTIRES": {
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-002"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
      },
    },
    "PUENTE ARANDA": {
      "CDC JOSÉ ANTONIO GALAN": {
        "CANCHA DE TEJO": ["CANCHA DE TEJO-001"],
        HUERTA: ["HUERTA-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "ZONAS VERDES": ["ZONAS VERDES-001"],
      },
      "CDC ASUNCIÓN": {
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
        ],
        "SALON DE CONFECCION": [
          "SALON DE CONFECCION-001",
          "SALON DE CONFECCION-002",
        ],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
      },
    },
    "RAFAEL URIBE URIBE": {
      "CDC SAMORE": {
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-004",
        ],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
      },
      "CDC MOLINOS": {
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
        ],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
      },
      "CDC COLINAS": {
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-002"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
    },
    "SAN CRISTOBAL": {
      "CDC LA VICTORIA": {
        COLISEO: ["COLISEO-001"],
        TEATRO: ["TEATRO-001"],
        "CANCHA DE TEJO": ["CANCHA DE TEJO-001"],
        "PISCINA GRANDE": ["PISCINA GRANDE-001"],
        HUERTA: ["HUERTA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-004",
          "SALON POLIVALENTE-006",
          "SALON POLIVALENTE-007",
        ],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-003"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
      "CDC SAN BLAS": {
        HUERTA: ["HUERTA-001", "HUERTA-002"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
        ],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        "SALON DE MUSICA": ["SALON DE MUSICA-001"],
      },
    },
    "SANTA FE": {
      "CDC LOURDES": {
        TEATRO: ["TEATRO-001"],
        COLISEO: ["COLISEO-001"],
        "CANCHA DE TEJO": ["CANCHA DE TEJO-001"],
        HUERTA: ["HUERTA-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
          "SALON POLIVALENTE-005",
          "SALON POLIVALENTE-007",
          "SALON POLIVALENTE-008",
        ],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        GIMNASIO: ["GIMNASIO-001"],
        "ZONAS VERDES": ["ZONAS VERDES-001"],
      },
    },
    SUBA: {
      "CDC TIBABUYES": {
        TEATRO: ["TEATRO-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": ["SALON POLIVALENTE-001", "SALON POLIVALENTE-002"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        PLAZOLETA: ["PLAZOLETA-001"],
      },
    },
    TUNJUELITO: {
      "CDC PABLO DE TARSO": {
        "SALON POLIVALENTE": ["SALON POLIVALENTE-002"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
      },
    },
    USAQUEN: {
      "CDC SIMON BOLIVAR": {
        COLISEO: ["COLISEO-001"],
        TEATRO: ["TEATRO-001"],
        "PISCINA GRANDE": ["PISCINA GRANDE-001"],
        "PISCINA PEQUEÑA": ["PISCINA PEQUEÑA-001"],
        HUERTA: ["HUERTA-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-003",
          "SALON POLIVALENTE-004",
          "SALON POLIVALENTE-005",
          "SALON POLIVALENTE-006",
          "SALON POLIVALENTE-007",
        ],
        GIMNASIO: ["GIMNASIO-001"],
        "SALON DE COCINA": ["SALON DE COCINA-002"],
        "SALON DE CONFECCION": [
          "SALON DE CONFECCION-001",
          "SALON DE CONFECCION-002",
        ],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        PLAZOLETA: ["PLAZOLETA-001", "PLAZOLETA-002"],
        "ZONAS VERDES": ["ZONAS VERDES-001"],
      },
    },
    USME: {
      "CDC JULIO CESAR SANCHEZ": {
        AUDITORIO: ["AUDITORIO-001"],
        HUERTA: ["HUERTA-001"],
        "LAVANDERIA COMUNITARIA": ["LAVANDERIA COMUNITARIA-001"],
        "SALON POLIVALENTE": [
          "SALON POLIVALENTE-001",
          "SALON POLIVALENTE-002",
          "SALON POLIVALENTE-004",
        ],
        GIMNASIO: ["GIMNASIO-001"],
        "SALON DE SISTEMAS": ["SALON DE SISTEMAS-001"],
        "SALON DE BELLEZA Y ESTETICA": ["SALON DE BELLEZA Y ESTETICA-001"],
        "SALON DE COCINA": ["SALON DE COCINA-001"],
        "SALON DE CONFECCION": ["SALON DE CONFECCION-001"],
        PLAZOLETA: [
          "PLAZOLETA-001",
          "PLAZOLETA-002",
          "PLAZOLETA-003",
          "PLAZOLETA-004",
          "PLAZOLETA-005",
        ],
        "ZONAS VERDES": ["ZONAS VERDES-001"],
      },
    },
  };

  constructor(
    private fb: FormBuilder,
    private equipamientoService: EquipamientoService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.equipmentForm = this.fb.group(
      {
        localidad: ["", Validators.required],
        cdc: [{ value: "", disabled: true }, Validators.required],
        tipoEquipamiento: [{ value: "", disabled: true }, Validators.required],
        equipamientoEnumerado: [
          { value: "", disabled: true },
          Validators.required,
        ],
        ocupacionServicio: ["", Validators.required],
        ocupacionSubdireccion: ["", Validators.required],
        usoEquipamiento: ["", Validators.required],
        estado: ["ABIERTO", Validators.required],
        motivoCierre: [{ value: "", disabled: true }],
        capacidad: [null, [Validators.required, Validators.min(1)]],
        diasDisponibles: this.fb.array([]),
        horaApertura: [""], // Se evalúa dinámicamente mediante el validador de grupo
        horaCierre: [""], // Se evalúa dinámicamente mediante el validador de grupo
        observaciones: [""],
        fechaVigencia: ["", Validators.required],
      },
      {
        validators: [this.validarHorariosDisponibles()], // 👈 Validador personalizado de tiempo y checklist
      },
    );

    this.initChecklistDias();
    this.escucharCambiosEstado();

    if (!this.authService.canManageEquipments()) {
      this.equipmentForm.disable();
    }
  }

  private initChecklistDias(): void {
    this.diasSemanaList.forEach(() =>
      this.diasDisponiblesFormArray.push(new FormControl(false)),
    );
  }

  get diasDisponiblesFormArray(): FormArray {
    return this.equipmentForm.get("diasDisponibles") as FormArray;
  }

  // 👈 VALIDADOR PERSONALIZADO: Horarios Obligatorios y Coherentes en función del Checklist
  private validarHorariosDisponibles(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const diasArray = formGroup.get("diasDisponibles") as FormArray;
      const horaApertura = formGroup.get("horaApertura")?.value;
      const horaCierre = formGroup.get("horaCierre")?.value;

      // Verificar si hay al menos un día marcado como 'true'
      const tieneDiasHabilitados = diasArray
        ? diasArray.controls.some((ctrl) => ctrl.value === true)
        : false;

      if (tieneDiasHabilitados) {
        const errors: any = {};

        // 1. Validar Obligatoriedad de Apertura
        if (!horaApertura) {
          errors["aperturaRequerida"] = true;
        }

        // 2. Validar Obligatoriedad de Cierre
        if (!horaCierre) {
          errors["cierreRequerido"] = true;
        }

        // 3. Validar que el Cierre sea Posterior a la Apertura
        if (horaApertura && horaCierre) {
          if (horaCierre <= horaApertura) {
            errors["cierreInvalido"] = true;
          }
        }

        return Object.keys(errors).length > 0 ? errors : null;
      }

      return null;
    };
  }

  private escucharCambiosEstado(): void {
    this.equipmentForm.get("estado")?.valueChanges.subscribe((estadoValue) => {
      const motivoCtrl = this.equipmentForm.get("motivoCierre");
      if (estadoValue === "CERRADO") {
        motivoCtrl?.enable();
        motivoCtrl?.setValidators([Validators.required]);
      } else {
        motivoCtrl?.reset("");
        motivoCtrl?.disable();
        motivoCtrl?.clearValidators();
      }
      motivoCtrl?.updateValueAndValidity();
    });
  }

  getLocalidades() {
    return Object.keys(this.dbCentros);
  }
  getCDCs() {
    return this.equipmentForm.get("localidad")?.value
      ? Object.keys(this.dbCentros[this.equipmentForm.get("localidad")?.value])
      : [];
  }
  getTipos() {
    const loc = this.equipmentForm.get("localidad")?.value;
    const cdc = this.equipmentForm.get("cdc")?.value;
    return loc && cdc ? Object.keys(this.dbCentros[loc][cdc]) : [];
  }
  getCodigos() {
    const loc = this.equipmentForm.get("localidad")?.value;
    const cdc = this.equipmentForm.get("cdc")?.value;
    const tipo = this.equipmentForm.get("tipoEquipamiento")?.value;
    return loc && cdc && tipo ? this.dbCentros[loc][cdc][tipo] : [];
  }

  onLocalidadChange() {
    this.equipmentForm.get("cdc")?.enable();
    this.equipmentForm.get("cdc")?.reset("");
  }
  onCdcChange() {
    this.equipmentForm.get("tipoEquipamiento")?.enable();
    this.equipmentForm.get("tipoEquipamiento")?.reset("");
  }
  onTipoChange() {
    this.equipmentForm.get("equipamientoEnumerado")?.enable();
    this.equipmentForm.get("equipamientoEnumerado")?.reset("");
  }

  saveEquipment(): void {
    if (this.equipmentForm.valid) {
      const checkedDias = this.equipmentForm.value.diasDisponibles;
      const tieneDias = checkedDias.some((val: boolean) => val === true);

      if (!tieneDias) {
        alert("Debe marcar al menos un día disponible en el checklist.");
        return;
      }

      const diasSeleccionados = checkedDias
        .map((checked: boolean, i: number) =>
          checked ? this.diasSemanaList[i] : null,
        )
        .filter((v: string | null) => v !== null)
        .join(", ");

      const formVal = this.equipmentForm.value;
      const payload = {
        cdc_id: 1,
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
      };

      this.equipamientoService.registrarEquipamiento(payload).subscribe({
        next: () => {
          alert("Equipamiento guardado y auditado con éxito.");
          this.equipmentForm.reset({ estado: "ABIERTO" });
          this.equipmentForm.get("cdc")?.disable();
          this.equipmentForm.get("tipoEquipamiento")?.disable();
          this.equipmentForm.get("equipamientoEnumerado")?.disable();
        },
        error: (err) => console.error("Error al persistir equipamiento:", err),
      });
    }
  }
}
