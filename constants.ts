
export const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const DAY_NAMES_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const AVAILABLE_TIME_SLOTS = {
  morning: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  afternoon: ["14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"],
};

// Generates a set of "unavailable" days for demonstration purposes
export function getMockUnavailableDays(year: number, month: number): Set<number> {
    const unavailable = new Set<number>();
    // For example, make every 4th day unavailable
    for (let i = 1; i <= 31; i += 4) {
        unavailable.add(i);
    }
    // Make weekends (Saturday/Sunday) unavailable
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 0 || date.getDay() === 6) { // 0 is Sunday, 6 is Saturday
            unavailable.add(day);
        }
    }
    return unavailable;
}
