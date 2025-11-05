
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ConfirmationFormProps {
  date: Date;
  time: string;
  onConfirm: (name: string, phone: string, notes: string) => void;
  isBooking: boolean;
  onBack: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ date, time, onConfirm, isBooking, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  const formattedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Por favor, complete los campos obligatorios.');
      return;
    }
    setError('');
    onConfirm(name, phone, notes);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Resumen del Turno</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2 mb-6">
            <div className="flex justify-between items-center">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-semibold text-gray-800">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-500">Horario:</span>
                <span className="font-semibold text-gray-800">{time}</span>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              placeholder="Ej: Juan Pérez"
              disabled={isBooking}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono de Contacto <span className="text-red-500">*</span></label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              placeholder="Ej: 1122334455"
              disabled={isBooking}
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas Adicionales (Opcional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              placeholder="Ej: El timbre no funciona, por favor llamar al llegar."
              disabled={isBooking}
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
           <p className="text-xs text-gray-500 text-center pt-2">
            Al confirmar, recibirás un mensaje de WhatsApp con los detalles de tu turno.
           </p>
        </form>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isBooking}
            className="w-full px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isBooking}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? <LoadingSpinner /> : 'Confirmar Turno'}
          </button>
      </div>
    </div>
  );
};

export default ConfirmationForm;