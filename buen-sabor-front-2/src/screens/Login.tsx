import { Link } from "react-router-dom";
import styles from "../styles/Login.module.css";
// Si estás usando react-router-dom para Link, ya lo tienes en Navbar. Si necesitas usarlo aquí, importalo:
// import { Link } from "react-router-dom"; 

export default function Login() {
    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>INICIAR SESIÓN</h2>
                <div className={styles.userIconContainer}>
                    <img src="/icons/user-circle.svg" alt="User Icon" className={styles.userIcon} />
                </div>

                <form className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="ejemplo@mail.com"
                            className={styles.loginInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>Contraseña*</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type="password"
                                id="password"
                                placeholder="************"
                                className={styles.loginInput}
                            />
                            <img src="/icons/eye-off.svg" alt="Show Password" className={styles.passwordToggleIcon} />
                        </div>
                    </div>

                    <button type="submit" className={styles.loginButton}>
                        INICIAR SESION
                    </button>

                    <p className={styles.orSeparator}>O INGRESA CON</p>

                    <button type="button" className={styles.googleLoginButton}>
                        <img src="/icons/google-icon.svg" alt="Google" className={styles.googleIcon} />
                        Entrar con Google
                    </button>

                    <p className={styles.signUpText}>
                        No tienes cuenta?{" "}
                        <Link to="/registro" className={styles.signUpLink}>
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};