import React from 'react';
import { AVAILABLE_TIME_SLOTS } from '../constants';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedDate, onTimeSelect, selectedTime }) => {
  // En una app real, los horarios disponibles podrían depender del día seleccionado.
  // Aquí usamos datos constantes para la demostración.
  const slots = AVAILABLE_TIME_SLOTS;
  
  const formattedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate);

  // Fix: Explicitly type TimeSlotButton as a React.FC to correctly handle the 'key' prop.
  // The 'key' prop is special in React and is not passed to the component,
  // but TypeScript needs to know this is a React component to handle it correctly.
  const TimeSlotButton: React.FC<{ time: string }> = ({ time }) => {
    const isSelected = selectedTime === time;
    return (
      <button
        onClick={() => onTimeSelect(time)}
        className={`w-full text-center p-3 rounded-lg border-2 transition-all duration-200 ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm' 
            : 'bg-white text-blue-700 border-blue-200 hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        {time}
      </button>
    );
  };
  
  return (
    <div className="flex flex-col space-y-6 p-4 bg-gray-50 rounded-lg h-full">
       <p className="text-center text-gray-600 font-medium">
        Horarios para el <span className="text-blue-600">{formattedDate}</span>
      </p>

      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-center">Mañana</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.morning.map(time => <TimeSlotButton key={time} time={time} />)}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-center">Tarde</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.afternoon.map(time => <TimeSlotButton key={time} time={time} />)}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;