export interface Sesion {
  id?: string;
  title: string;
  start: string; // Formato ISO YYYY-MM-DDTHH:mm:ss
  end: string; // Formato ISO YYYY-MM-DDTHH:mm:ss
  estado: 'Programada' | 'Realizada' | 'Cancelada';
  localidad: string;
  cdc: string;
  tipoEquipamiento: string;
  nombreCurso: string;
  color?: string;
}
