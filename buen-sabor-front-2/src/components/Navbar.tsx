import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
    const [open, setOpen] = useState(false);

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
                        {/* Botón Perfil */}
                        <div
                            onClick={() => setOpen(!open)}
                            className={styles.profileButton}
                        >
                            Perfil
                        </div>

                        {open && (
                            <div className={styles.dropdown}>
                                <ul className={styles.dropdownList}>
                                    <li>
                                        <Link
                                            to="/login"
                                            className={styles.dropdownItem}
                                            onClick={() => setOpen(false)}
                                        >
                                            INGRESAR
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={() => setOpen(false)}
                                        >
                                            Cerrar Sesión
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
