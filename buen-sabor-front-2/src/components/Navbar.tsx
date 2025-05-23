import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-10 bg-[#FFD284] flex justify-between items-center px-6 py-4 rounded-t-lg shadow">
            {/* Logo */}
            <div className="text-2xl font-bold">
                Buen<span className="text-amber-500">SABOR</span>
            </div>

            {/* Navegación */}
            <nav>
                <ul className="flex items-center space-x-6 font-semibold">
                    <li><Link to="/" className="hover:text-amber-50">Inicio</Link></li>
                    <li><Link to="/menu" className="hover:text-amber-50">MENÚ</Link></li>
                    <li className="relative">
                        {/* Botón Perfil */}
                        <div
                            onClick={() => setOpen(!open)}
                            className="cursor-pointer px-4 py-1 border-2 border-amber-500 rounded-xl hover:bg-amber-100"
                        >
                            Perfil
                        </div>

                        {/* Menú desplegable */}
                        {open && (
                            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10">
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/perfil"
                                            className="block px-4 py-2 hover:bg-amber-100 rounded"
                                            onClick={() => setOpen(false)}
                                        >
                                            Mi Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-amber-100 rounded"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}
