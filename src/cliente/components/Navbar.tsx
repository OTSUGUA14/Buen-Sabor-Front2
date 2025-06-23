import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/Navbar.module.css';
import { useUser } from './UserContext';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { profile, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/login");
    };

    return (
        <header className={styles.header}>
            {/* Logo */}
            <div className={styles.logo}>
                Buen<span className={styles.logoAccent}>SABOR</span>
            </div>

            {/* Navegación */}
            <nav>
                <ul className={styles.navList}>
                    <li><Link to="/" className={styles.navLink}>Inicio</Link></li>
                    <li><Link to="/menu" className={styles.navLink}>MENÚ</Link></li>
                    <li className={styles.profileWrapper}>
                        {/* Botón Perfil o Iniciar sesión */}
                        {profile ? (
                            <div
                                onClick={() => setOpen(!open)}
                                className={styles.profileButton}
                            >
                                Perfil
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={styles.profileButton}
                            >
                                Iniciar sesión
                            </Link>
                        )}

                        {/* Dropdown solo si hay perfil */}
                        {profile && open && (
                            <div className={styles.dropdown}>
                                <ul className={styles.dropdownList}>
                                    <li>
                                        <Link
                                            to="/profile"
                                            className={styles.dropdownItem}
                                            onClick={() => setOpen(false)}
                                        >
                                            Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/ordenes"
                                            className={styles.dropdownItem}
                                            onClick={() => setOpen(false)}
                                        >
                                            Pedidos
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className={styles.dropdownItem}
                                            style={{ background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            Cerrar sesión
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