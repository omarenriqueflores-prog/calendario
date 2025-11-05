
import React, { useState, useCallback } from 'react';
import Calendar from './components/Calendar';
import TimeSlotPicker from './components/TimeSlotPicker';
import ConfirmationForm from './components/ConfirmationForm';
import SuccessMessage from './components/SuccessMessage';
import { AppointmentDetails } from './types';
import { saveAppointment } from './services/appointmentService';

// Placeholder Logo Component
const CompanyLogo = () => (
    <svg className="h-10 w-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12.5 16.5h-1V11h1v5.5zm-1-7.5h1v-1h-1v1zM10 12l4-4-1.41-1.41L9 10.17V15h2v-3z" />
    </svg>
);


export default function App() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    }, []);

    const handleTimeSelect = useCallback((time: string) => {
        setSelectedTime(time);
    }, []);

    const handleBookingConfirm = async (customerName: string, customerPhone: string) => {
        if (!selectedDate || !selectedTime) return;

        setIsBooking(true);
        setError(null);

        const appointmentData: AppointmentDetails = {
            date: selectedDate,
            time: selectedTime,
            customerName,
            customerPhone,
        };

        try {
            const success = await saveAppointment(appointmentData);
            if (success) {
                setAppointmentDetails(appointmentData);
            } else {
                setError('No se pudo agendar el turno. Por favor, intente de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado. Por favor, intente más tarde.');
        } finally {
            setIsBooking(false);
        }
    };
    
    const handleReset = () => {
        setSelectedDate(null);
        setSelectedTime(null);
        setAppointmentDetails(null);
        setError(null);
        setIsBooking(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <header className="mb-6 text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <CompanyLogo />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">CableNet Plus</h1>
                </div>
                <p className="text-gray-600 text-lg">Servicio de TV & Internet</p>
            </header>

            <main className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500">
                {appointmentDetails ? (
                    <SuccessMessage details={appointmentDetails} onReset={handleReset} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                1. Seleccione una fecha
                            </h2>
                            <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
                        </div>

                        <div className="flex flex-col">
                            {selectedDate && !selectedTime && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                        2. Seleccione un horario
                                    </h2>
                                    <TimeSlotPicker selectedDate={selectedDate} onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
                                </>
                            )}
                            {selectedDate && selectedTime && (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                        3. Confirme sus datos
                                    </h2>
                                    <ConfirmationForm
                                        date={selectedDate}
                                        time={selectedTime}
                                        onConfirm={handleBookingConfirm}
                                        isBooking={isBooking}
                                        onBack={() => setSelectedTime(null)}
                                    />
                                </>
                            )}
                            {!selectedDate && (
                                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-8">
                                    <p className="text-gray-500 text-center">Por favor, elija un día en el calendario para ver los horarios disponibles.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                 {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </main>
            <footer className="mt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} CableNet Plus. Todos los derechos reservados.</p>
                <p className="mt-1">Esta es una página para agendar su turno de instalación. Un técnico se presentará en la fecha y hora seleccionada.</p>
            </footer>
        </div>
    );
}
