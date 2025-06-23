import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';
import { SelectField } from './SelectField';

interface ISelectOption {
    value: string;
    label: string;
}

interface SidebarProps { }

const statusOptions: ISelectOption[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Cocinero', label: 'Cocinero' },
    { value: 'Cajero', label: 'Cajero' },
    { value: 'Delivery', label: 'Delivery' },
];

// Mapeo de roles del backend a español
const roleMap: Record<string, string> = {
    ADMIN: 'Admin',
    CHEF: 'Cocinero',
    CASHIER: 'Cajero',
    DRIVER: 'Delivery'
};

export const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Obtener el rol del localStorage y mapearlo a español
    const backendRole = localStorage.getItem('employeeRole');
    if (!backendRole) return null; // No mostrar nada si no hay rol

    const role = roleMap[backendRole] || 'Admin';

    // Opciones de menú según el rol
    let menuOptions: { to: string; label: string }[] = [];

    if (role === 'Admin') {
        menuOptions = [
            { to: '/admin/products', label: 'Productos' },
            { to: '/admin/supplies', label: 'Insumos' },
            { to: '/admin/category', label: 'Categorias' },
            { to: '/admin/employees', label: 'Personal' },
            { to: '/admin/orders', label: 'Ordenes' },
            { to: '/admin/statistics', label: 'Estadisticas' }
        ];
    } else if (role === 'Cajero') {
        menuOptions = [
            { to: '/admin/products', label: 'Productos' }
        ];
    } else if (role === 'Cocinero') {
        menuOptions = [
            { to: '/admin/products', label: 'Productos' },
            { to: '/admin/supplies', label: 'Insumos' },
            { to: '/admin/category', label: 'Categorias' },
            { to: '/admin/orders', label: 'Ordenes' }
        ];
    } else if (role === 'Delivery') {
        menuOptions = [
            { to: '/admin/orders', label: 'Ordenes' }
        ];
    }

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <ul>
                    {menuOptions.map(option => (
                        <li key={option.to}>
                            <Link
                                to={option.to}
                                className={location.pathname === option.to ? 'active' : ''}
                            >
                                {option.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
