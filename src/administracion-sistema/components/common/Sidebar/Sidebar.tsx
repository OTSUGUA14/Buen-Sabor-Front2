import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { SelectField } from '../SelectField/SelectField';

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

// Mapa de rutas 
const roleRoutes: { [key: string]: string } = {
    'Cocinero': '/admin/kitchen-orders',
    'Cajero': '/admin/cash-orders',
    'Delivery': '/admin/delivery-orders',
    'Admin': '/admin/products'
};

export const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('Seleccionar Rol');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStatusFilter(value);

        const path = roleRoutes[value];
        if (path) {
            navigate(path);
        }
    };

    return (
        <aside className="sidebar">
            <nav className="nav-menu">
                <ul>
                    <li className="status-filter">
                        <SelectField
                            name="statusFilter"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={handleChange}
                            className="status-select"
                        />
                    </li>
                    <li>
                        <Link to="/admin/products" className={location.pathname === '/admin/products' ? 'active' : ''}>
                            Productos
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/supplies" className={location.pathname === '/admin/supplies' ? 'active' : ''}>
                            Insumos
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/category" className={location.pathname === '/admin/category' ? 'active' : ''}>
                            Categorias
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/employees" className={location.pathname === '/admin/employees' ? 'active' : ''}>
                            Personal
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/statistics" className={location.pathname === '/admin/statistics' ? 'active' : ''}>
                            Estadisticas
                        </Link>
                    </li>

                </ul>
            </nav>
        </aside>
    );
};
