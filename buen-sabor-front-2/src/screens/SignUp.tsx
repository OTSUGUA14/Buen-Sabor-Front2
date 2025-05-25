import { Link } from "react-router-dom";
import styles from "../styles/Login.module.css"; // Reutilizamos los estilos del Login

export default function SignUp() {
    return (
        <div className={styles.loginPageContainer}> {/* Se reutiliza el contenedor de la página de login */}
            <div className={styles.loginCard}> {/* Se reutiliza la tarjeta de login */}
                <h2 className={styles.loginTitle}>REGÍSTRATE</h2> {/* Título de la página de registro */}
                <div className={styles.userIconContainer}>
                    <img src="/icons/user-circle.svg" alt="User Icon" className={styles.userIcon} />
                </div>

                <form className={styles.loginForm}> {/* Se reutiliza el formulario */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.inputLabel}>Nombre*</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Juan Perez"
                            className={styles.loginInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="ejemplo@email.com"
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.inputLabel}>Repetir contraseña*</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="************"
                                className={styles.loginInput}
                            />
                            <img src="/icons/eye-off.svg" alt="Show Password" className={styles.passwordToggleIcon} />
                        </div>
                    </div>

                    <button type="submit" className={styles.loginButton}> {/* Se reutiliza el botón de login, pero con texto de registro */}
                        REGISTRARSE
                    </button>

                    <p className={styles.orSeparator}>O REGÍSTRATE CON</p> {/* Texto del separador */}

                    <button type="button" className={styles.googleLoginButton}> {/* Botón de Google */}
                        <img src="/icons/google-icon.svg" alt="Google" className={styles.googleIcon} />
                        Entrar con Google
                    </button>

                    <p className={styles.signUpText}>
                        Ya tienes cuenta?{" "}
                        <Link to="/Login" className={styles.signUpLink}> {/* Enlace para iniciar sesión */}
                            Iniciar sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}