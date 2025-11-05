
export const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const DAY_NAMES_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/**
 * Devuelve los rangos horarios disponibles para una fecha específica.
 * @param {Date} date - La fecha para la que se solicitan los horarios.
 * @returns {string[]} - Un array de strings con los horarios.
 */
export function getAvailableTimeSlotsForDate(date: Date): string[] {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  switch (dayOfWeek) {
    case 1: // Lunes
    case 2: // Martes
    case 3: // Miércoles
      return [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
        "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00"
      ];
    case 4: // Jueves
    case 5: // Viernes
      return [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
        "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00",
        "15:00 - 16:00"
      ];
    case 6: // Sábado
      return [
        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
        "12:00 - 13:00"
      ];
    case 0: // Domingo
    default:
      return []; // No hay turnos disponibles
  }
}

/**
 * Genera un conjunto de días no disponibles (solo domingos).
 * @param {number} year - El año.
 * @param {number} month - El mes (0-11).
 * @returns {Set<number>} - Un conjunto con los números de los días no disponibles.
 */
export function getMockUnavailableDays(year: number, month: number): Set<number> {
    const unavailable = new Set<number>();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 0) { // 0 es Domingo
            unavailable.add(day);
        }
    }
    return unavailable;
}
