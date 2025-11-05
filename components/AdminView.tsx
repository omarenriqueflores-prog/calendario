import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { getAllAppointments, deleteAppointment } from '../services/appointmentService';
import { BookedAppointment } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { supabase } from '../services/supabaseClient';

const AdminView: React.FC = () => {
    const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                const data = await getAllAppointments();
                setAppointments(data);
            } catch (err: any) {
                setError(err.message || "No se pudieron cargar los turnos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();

        const channel = supabase
            .channel('admin-turnos-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'turnos' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setAppointments(currentAppointments => 
                            [...currentAppointments, payload.new as BookedAppointment]
                            .sort((a,b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
                        );
                    }
                    if (payload.eventType === 'UPDATE') {
                        setAppointments(currentAppointments =>
                            currentAppointments.map(app =>
                                app.id === payload.new.id ? (payload.new as BookedAppointment) : app
                            )
                        );
                    }
                    if (payload.eventType === 'DELETE') {
                        setAppointments(currentAppointments =>
                            currentAppointments.filter(app => app.id !== (payload.old as any).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDeleteAppointment = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este turno? Esta acción no se puede deshacer.')) {
            try {
                await deleteAppointment(id);
                // La UI se actualizará automáticamente gracias a la suscripción en tiempo real de Supabase.
                // Para una respuesta más inmediata, se podría filtrar el estado aquí:
                // setAppointments(prev => prev.filter(app => app.id !== id));
            } catch (error) {
                console.error('Error al eliminar el turno:', error);
                setError('No se pudo eliminar el turno. Inténtelo de nuevo.');
            }
        }
    };

    const appointmentsOnSelectedDate = appointments.filter(app => {
        if (!selectedDate) return false;
        return new Date(app.fecha_hora).toDateString() === selectedDate.toDateString();
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
                <span className="ml-3 text-gray-600">Cargando turnos...</span>
            </div>
        );
    }
    
    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }
    
    return (
        <div>
             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Panel de Administración</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h3 className="text-xl font-semibold text-gray-700 mb-4">Calendario de Turnos</h3>
                     <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Turnos para el {selectedDate ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(selectedDate) : '...'}
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[24rem] h-full overflow-y-auto">
                        {appointmentsOnSelectedDate.length > 0 ? (
                             <ul className="space-y-4">
                                {appointmentsOnSelectedDate.sort((a,b) => a.horario_texto.localeCompare(b.horario_texto)).map(app => (
                                    <li key={app.id} className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500 flex flex-col">
                                        <div>
                                            <p className="font-bold text-blue-800">{app.horario_texto}</p>
                                            <p className="text-sm text-gray-700">Cliente: {app.nombre_cliente}</p>
                                            <p className="text-sm text-gray-600">Teléfono: {app.telefono_cliente}</p>
                                            {app.notas_cliente && <p className="text-sm text-gray-500 mt-1 italic">Notas: "{app.notas_cliente}"</p>}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-blue-200">
                                            <button
                                                onClick={() => handleDeleteAppointment(app.id)}
                                                className="w-full text-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                                            >
                                                Eliminar Turno
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No hay turnos agendados para este día.</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
};

export default AdminView;