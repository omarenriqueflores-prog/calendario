
import React, { useState, useCallback } from 'react';
import Calendar from './components/Calendar';
import TimeSlotPicker from './components/TimeSlotPicker';
import ConfirmationForm from './components/ConfirmationForm';
import SuccessMessage from './components/SuccessMessage';
import Header from './components/Header';
import AdminView from './components/AdminView';
import Login from './components/Login';
import { AppointmentDetails } from './types';
import { saveAppointment } from './services/appointmentService';

// Info Icon Component
const InfoIcon = () => (
    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


export default function App() {
    const [view, setView] = useState<'customer' | 'admin'>('customer');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetBookingState = useCallback(() => {
        setSelectedDate(null);
        setSelectedTime(null);
        setAppointmentDetails(null);
        setError(null);
        setIsBooking(false);
    }, []);

    const handleNavigate = (targetView: 'customer' | 'admin') => {
        setView(targetView);
        if (targetView === 'customer') {
          resetBookingState();
        }
    };

    const handleLoginSuccess = () => {
        setIsAdminLoggedIn(true);
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
        setView('customer');
    };

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    }, []);

    const handleTimeSelect = useCallback((time: string) => {
        setSelectedTime(time);
    }, []);

    const handleBookingConfirm = async (customerName: string, customerPhone: string, notes: string) => {
        if (!selectedDate || !selectedTime) return;

        setIsBooking(true);
        setError(null);

        const appointmentData: AppointmentDetails = {
            date: selectedDate,
            time: selectedTime,
            customerName,
            customerPhone,
            customerNotes: notes,
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
    
    const renderCustomerView = () => (
        <>
            {appointmentDetails ? (
                <SuccessMessage details={appointmentDetails} />
            ) : (
                <>
                    {/* Mobile-only placeholder */}
                    {!selectedDate && (
                        <div className="md:hidden mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InfoIcon />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-800">Por favor, elija un día en el calendario para ver los horarios disponibles.</p>
                                </div>
                            </div>
                        </div>
                    )}
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
                                <div className="h-full hidden md:flex items-center justify-center bg-blue-50 rounded-lg p-8 border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <InfoIcon />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-blue-800">
                                                Por favor, elija un día en el calendario para ver los horarios disponibles.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </>
    );

    const renderAdminSection = () => {
        if (isAdminLoggedIn) {
            return <AdminView />;
        }
        return <Login onLoginSuccess={handleLoginSuccess} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
            <div className="w-full max-w-4xl">
                <Header onNavigate={handleNavigate} currentView={view} isLoggedIn={isAdminLoggedIn} onLogout={handleLogout} />

                <main className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500">
                    {view === 'admin' ? renderAdminSection() : renderCustomerView()}
                </main>
            </div>
            <footer className="mt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Tartagal Comunicaciones. Todos los derechos reservados.</p>
                <p className="mt-1">Esta es una página para agendar su turno de instalación. Un técnico se presentará en la fecha y hora seleccionada.</p>
            </footer>
        </div>
    );
}