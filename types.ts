
export interface AppointmentDetails {
  date: Date;
  time: string;
  customerName: string;
  customerPhone: string;
  customerNotes?: string;
  latitude?: number;
  longitude?: number;
}

export interface BookedAppointment {
  id: number;
  fecha_hora: string;
  nombre_cliente: string;
  telefono_cliente: string;
  horario_texto: string;
  notas_cliente?: string;
  latitud?: number;
  longitud?: number;
}