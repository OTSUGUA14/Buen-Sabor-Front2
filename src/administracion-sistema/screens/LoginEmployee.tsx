import { useState } from "react";
import {useNavigate } from "react-router-dom";
import styles from "../../../styles/Login.module.css";
import { loginUser } from "../../cliente/services/Api";
import { useUser } from "../../cliente/components/UserContext";
import type { UserLogin } from "../../cliente/types/UserLogin";


export default function Login() {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setProfile } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //  const userToLogin: UserLogin = {
        //      username: username,
        //      password: password
        //  };

        // const profile = await loginUser(userToLogin);
        // if (profile) {
        //     setProfile(profile);
        //     navigate("/admin"); 
        // }
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
                            id="username"
                            placeholder="juanperez@buensabor.com"  
                            className={styles.loginInput}
                            value={username}
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
                </form>
            </div>
        </div>
    );
}
