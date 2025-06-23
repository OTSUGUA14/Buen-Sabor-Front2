import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import './AdminLayout.css';

// Mapeo de roles a español
const roleMap: Record<string, string> = {
    ADMIN: "Administrador",
    CASHIER: "Cajero",
    CHEF: "Cocinero",
    DRIVER: "Repartidor"
};

export const AdminLayout: React.FC = () => {
    const role = localStorage.getItem("employeeRole");
    const roleEs = role ? (roleMap[role] || role) : "";
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("employeeRole");
        navigate("/admin/loginEmployee");
    };

    return (
        <div className="admin-layout">

            <Sidebar />
            <main className="main-content">
                {role && (
                    <header className="admin-header">
                        <div className="header-right">
                            <span className="user-info">{roleEs}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    </header>
                )}
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};