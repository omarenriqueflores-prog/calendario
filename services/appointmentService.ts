
import { AppointmentDetails, BookedAppointment } from '../types';
import { supabase } from './supabaseClient';

/**
 * Guarda un turno en la base de datos de Supabase.
 *
 * @param {AppointmentDetails} appointmentData - Los detalles del turno a guardar.
 * @returns {Promise<boolean>} - Resuelve a `true` si fue exitoso.
 * @throws {Error} - Lanza un error si falla la inserción en la base de datos.
 */
export const saveAppointment = async (appointmentData: AppointmentDetails): Promise<boolean> => {
  console.log("Guardando turno en Supabase:", appointmentData);

  // Combina la fecha y la hora para crear un objeto Date completo
  const appointmentDateTime = new Date(appointmentData.date);
  // Extrae la hora de inicio del string "HH:mm - HH:mm"
  const [hours, minutes] = appointmentData.time.split(' - ')[0].split(':');
  appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  const { data, error } = await supabase
    .from('turnos') // Asegúrate de que tu tabla se llame 'turnos'
    .insert([
      {
        fecha_hora: appointmentDateTime.toISOString(),
        nombre_cliente: appointmentData.customerName,
        telefono_cliente: appointmentData.customerPhone,
        horario_texto: appointmentData.time,
        notas_cliente: appointmentData.customerNotes,
      },
    ])
    .select();

  if (error) {
    console.error("Error al guardar el turno en Supabase:", error);
    // Lanzamos un error para que sea capturado por el bloque try-catch en App.tsx
    throw new Error(`Error de Supabase: ${error.message}`);
  }

  console.log("Turno guardado exitosamente en Supabase:", data);
  return true;
};

/**
 * Obtiene los horarios de los turnos ya agendados para una fecha específica.
 *
 * @param {Date} date - La fecha para la cual se quieren obtener los turnos.
 * @returns {Promise<string[]>} - Una promesa que resuelve a un array de strings con los horarios ocupados.
 */
export const getAppointmentsForDate = async (date: Date): Promise<string[]> => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('turnos')
    .select('horario_texto')
    .gte('fecha_hora', startDate.toISOString())
    .lte('fecha_hora', endDate.toISOString());

  if (error) {
    console.error('Error al obtener los turnos para la fecha:', error);
    return [];
  }

  return data.map(turno => turno.horario_texto);
};


/**
 * Obtiene todos los turnos agendados.
 *
 * @returns {Promise<BookedAppointment[]>} - Una promesa que resuelve a un array con todos los turnos.
 */
export const getAllAppointments = async (): Promise<BookedAppointment[]> => {
  const { data, error } = await supabase
    .from('turnos')
    .select('*')
    .order('fecha_hora', { ascending: true });

  if (error) {
    console.error('Error al obtener todos los turnos:', error);
    throw new Error('No se pudieron cargar los turnos.');
  }

  return data as BookedAppointment[];
};
