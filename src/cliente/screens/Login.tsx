import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import type { UserLogin } from "../types/UserLogin";
import { loginUser } from "../services/Api";
import { useUser } from "../../cliente/components/UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setProfile } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert("Por favor, completa el usuario y la contraseña.");
            return;
        }

        const userToLogin: UserLogin = {
            email: email,
            password: password
        };

        const profile = await loginUser(userToLogin);
        if (profile) {
            setProfile(profile);
            navigate("/menu"); // Redirige solo después de guardar el perfil
        }
    };

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>INICIAR SESIÓN</h2>
                <div className={styles.userIconContainer}>
                    <img src="/icons/user-circle.svg" alt="User Icon" className={styles.userIcon} />
                </div>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Correo electrónico</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="otsu"  
                            className={styles.loginInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
}
