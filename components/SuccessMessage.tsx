
import React from 'react';
import { AppointmentDetails } from '../types';

interface SuccessMessageProps {
  details: AppointmentDetails;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ details, onReset }) => {
  const formattedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(details.date);

  return (
    <div className="text-center py-10 px-6">
      <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">¡Turno confirmado!</h2>
      <p className="text-gray-600 mt-2">Gracias, {details.customerName}. Hemos agendado su turno exitosamente.</p>
      <p className="text-gray-600 mt-1">Hemos enviado una confirmación a su WhatsApp.</p>

      <div className="mt-8 text-left max-w-md mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Detalles del Turno</h3>
        <div className="flex justify-between items-center">
            <span className="text-gray-500">Fecha:</span>
            <span className="font-semibold text-gray-900">{formattedDate}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-gray-500">Horario:</span>
            <span className="font-semibold text-gray-900">{details.time}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-gray-500">Teléfono:</span>
            <span className="font-semibold text-gray-900">{details.customerPhone}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        También recibirá un recordatorio por WhatsApp un día antes de su cita.
      </p>
      
      <button
        onClick={onReset}
        className="mt-8 px-8 py-3 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
      >
        Agendar otro turno
      </button>
    </div>
  );
};

export default SuccessMessage;