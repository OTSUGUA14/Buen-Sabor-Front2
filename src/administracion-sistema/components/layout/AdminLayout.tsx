import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
    const [open, setOpen] = useState(false);
    const role = localStorage.getItem("employeeRole");
    const roleEs = role ? (roleMap[role] || role) : "";
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("employeeRole");
        setOpen(false);
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
                            <div className="profile-wrapper">
                                <button 
                                    className="user-info"
                                    onClick={() => setOpen(!open)}
                                >
                                    {roleEs}
                                </button>
                                
                                {open && (
                                    <div className="dropdown">
                                        <ul className="dropdown-list">
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="dropdown-item"
                                                >
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
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