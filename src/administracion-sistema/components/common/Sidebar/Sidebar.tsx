// src/administracion-sistema/components/sidebar/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
    // ...
}

export const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <ul>
                    <li>
                        <Link
                            to="/admin/products"
                            className={location.pathname === '/admin/products' ? 'active' : ''}
                        >
                            Productos
                        </Link>
                    </li>
                    <li> {/* <-- NUEVO: Enlace a Insumos */}
                        <Link
                            to="/admin/supplies"
                            className={location.pathname === '/admin/supplies' ? 'active' : ''}
                        >
                            Insumos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/clients"
                            className={location.pathname === '/admin/clients' ? 'active' : ''}
                        >
                            Clientes
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/personal"
                            className={location.pathname === '/admin/personal' ? 'active' : ''}
                        >
                            Personal
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/statistics"
                            className={location.pathname === '/admin/statistics' ? 'active' : ''}
                        >
                            Estadísticas
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};