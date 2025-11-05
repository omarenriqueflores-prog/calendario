
import React, { useState, useRef, useEffect } from 'react';

const CompanyLogo = () => (
    <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

const UserIcon = () => (
    <svg className="h-6 w-6 text-gray-600 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface HeaderProps {
    onNavigate: (view: 'customer' | 'admin') => void;
    currentView: 'customer' | 'admin';
    isLoggedIn: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, isLoggedIn, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (view: 'customer' | 'admin') => {
        onNavigate(view);
        setIsDropdownOpen(false);
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onLogout();
        setIsDropdownOpen(false);
    }

    return (
        <header className="w-full flex justify-between items-center py-4">
            <div 
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => handleNavigation('customer')}
                title="Ir a la página de inicio"
            >
                <CompanyLogo />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Tartagal Comunicaciones</h1>
                    <p className="text-gray-600 text-left hidden sm:block">Servicio de TV & Internet</p>
                </div>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                    aria-label="Menú de administración"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <UserIcon />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        {isLoggedIn ? (
                            <>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleNavigation('admin'); }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Ver Panel
                                </a>
                                <a
                                    href="#"
                                    onClick={handleLogoutClick}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    Cerrar Sesión
                                </a>
                            </>
                        ) : (
                             <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleNavigation('admin'); }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Administración
                            </a>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
