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
            <main className="main-content">
                {role && (
                    <header className="admin-header">
                        <div className="logo">
                            Buen<span className="logoAccent">SABOR</span>
                        </div>
                        <div className="header-right">
                            <button className="user-info">{roleEs}</button>
                            <button className="logout-btn" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    </header>

                )}
                <div className='container-page-content'>
                    <Sidebar />
                    <div className="page-content">
                        <Outlet />
                    </div>
                </div>

            </main>
        </div>
    );
};