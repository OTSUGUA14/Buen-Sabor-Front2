
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
                    <li> 
                        <Link
                            to="/admin/supplies"
                            className={location.pathname === '/admin/supplies' ? 'active' : ''}
                        >
                            Insumos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/category"
                            className={location.pathname === '/admin/category' ? 'active' : ''}
                        >
                            Categorias
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/employees"
                            className={location.pathname === '/admin/employees' ? 'active' : ''}
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