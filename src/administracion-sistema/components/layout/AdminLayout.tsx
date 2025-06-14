
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import './AdminLayout.css'; 

export const AdminLayout: React.FC = () => {
    return (
        <div className="admin-layout">
            <Sidebar /> 
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