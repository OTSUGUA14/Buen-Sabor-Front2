
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar/Sidebar'; // <-- Importa el nuevo componente Sidebar
import './AdminLayout.css'; // Mantén solo los estilos del layout general aquí

export const AdminLayout: React.FC = () => {
    return (
        <div className="admin-layout">
            <Sidebar /> {/* <-- Renderiza el componente Sidebar aquí */}
            <main className="main-content">
                <header className="admin-header">
                    <div className="header-right">
                        <span className="user-info">ADMIN</span>
                    </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};