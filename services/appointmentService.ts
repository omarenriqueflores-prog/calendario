import { AppointmentDetails, BookedAppointment } from '../types';
import { supabase } from './supabaseClient';

const RLS_ERROR_MESSAGE = 'violates row-level security policy';

/**
 * Guarda un turno en la base de datos de Supabase.
 *
 * @param {AppointmentDetails} appointmentData - Los detalles del turno a guardar.
 * @returns {Promise<boolean>} - Resuelve a `true` si fue exitoso.
 * @throws {Error} - Lanza un error si falla la inserción en la base de datos.
 */
export const saveAppointment = async (appointmentData: AppointmentDetails): Promise<boolean> => {
  console.log("Guardando turno en Supabase:", appointmentData);

  const appointmentDateTime = new Date(appointmentData.date);
  const [hours, minutes] = appointmentData.time.split(' - ')[0].split(':');
  appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  const { data, error } = await supabase
    .from('turnos')
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
    if (error.message.includes(RLS_ERROR_MESSAGE)) {
      throw new Error(
        'Permiso denegado al crear el turno.\n' +
        'Esto significa que la tabla "turnos" no tiene una Política (Policy) que permita la operación de CREACIÓN (INSERT).\n' +
        'Por favor, ve a la sección "Authentication" -> "Policies" de tu proyecto en Supabase y crea una política para ello.'
      );
    }
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
    if (error.message.includes(RLS_ERROR_MESSAGE)) {
      throw new Error(
        'Permiso denegado al leer los horarios.\n' +
        'Esto significa que la tabla "turnos" no tiene una Política (Policy) que permita la operación de LECTURA (SELECT).\n' +
        'Por favor, ve a la sección "Authentication" -> "Policies" de tu proyecto en Supabase y crea una política para ello.'
      );
    }
    throw new Error(`Error de Supabase: ${error.message}`);
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
     if (error.message.includes(RLS_ERROR_MESSAGE)) {
      throw new Error(
        'Permiso denegado al cargar los turnos.\n' +
        'Esto significa que la tabla "turnos" no tiene una Política (Policy) que permita la operación de LECTURA (SELECT).\n' +
        'Por favor, ve a la sección "Authentication" -> "Policies" de tu proyecto en Supabase y crea una política para ello.'
      );
    }
    throw new Error('No se pudieron cargar los turnos.');
  }

  return data as BookedAppointment[];
};
