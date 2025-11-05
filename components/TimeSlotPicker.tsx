import React, { useState, useEffect } from 'react';
import { getAvailableTimeSlotsForDate } from '../constants';
import { getAppointmentsForDate } from '../services/appointmentService';
import { supabase } from '../services/supabaseClient';
import { BookedAppointment } from '../types';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

const TimeSlotButton: React.FC<{ time: string; isSelected: boolean; onClick: (time: string) => void }> = ({ time, isSelected, onClick }) => (
  <button
    onClick={() => onClick(time)}
    className={`w-full text-center p-3 rounded-lg border-2 transition-all duration-200 ${
      isSelected 
        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm' 
        : 'bg-white text-blue-700 border-blue-200 hover:border-blue-500 hover:bg-blue-50'
    }`}
  >
    {time}
  </button>
);

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedDate, onTimeSelect, selectedTime }) => {
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      setError(null);
      getAppointmentsForDate(selectedDate)
        .then(slots => {
          setBookedSlots(new Set(slots));
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch booked slots", error);
          setError("No se pudieron cargar los horarios. Intente de nuevo.");
          setIsLoading(false);
        });
    }
  }, [selectedDate]);

  // Efecto para actualizaciones en tiempo real de los turnos ocupados
  useEffect(() => {
    if (!selectedDate) return;

    const channel = supabase
      .channel('turnos-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'turnos' },
        (payload) => {
          const record = (payload.new || payload.old) as BookedAppointment;
          const appointmentDate = new Date(record.fecha_hora);

          // Comprobar si el nuevo turno corresponde a la fecha seleccionada
          if (appointmentDate.toDateString() === selectedDate.toDateString()) {
            if (payload.eventType === 'INSERT') {
              setBookedSlots(prevSlots => new Set([...prevSlots, record.horario_texto]));
            } else if (payload.eventType === 'DELETE') {
              setBookedSlots(prevSlots => {
                const newBookedSlots = new Set(prevSlots);
                newBookedSlots.delete(record.horario_texto);
                return newBookedSlots;
              });
            }
          }
        }
      )
      .subscribe();

    // Limpiar la suscripción al desmontar el componente o cambiar de fecha
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const potentialSlots = getAvailableTimeSlotsForDate(selectedDate);
  const availableSlots = potentialSlots.filter(slot => !bookedSlots.has(slot));
  const formattedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 animate-pulse">Cargando horarios disponibles...</p>
      </div>
    );
  }
  
  if (error) {
      return (
          <div className="flex justify-center items-center h-full p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-center">{error}</p>
          </div>
      );
  }
  
  const renderContent = () => {
    if (potentialSlots.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-md">
            No se trabaja en el día seleccionado.
          </p>
        </div>
      );
    }

    if (availableSlots.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-md">
            No quedan turnos disponibles para este día.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableSlots.map(time => (
          <TimeSlotButton 
            key={time} 
            time={time} 
            isSelected={selectedTime === time} 
            onClick={onTimeSelect} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-4 bg-gray-50 rounded-lg h-full">
      <p className="text-center text-gray-600 font-medium">
        Horarios para el <span className="text-blue-600">{formattedDate}</span>
      </p>
      {renderContent()}
    </div>
  );
};

export default TimeSlotPicker;