import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/LoginEmployee.module.css";
import { loginEmploye } from "../utils/Api"; // Asegúrate de importar tu función correcta

export default function LoginEmployee() {
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const employeeToLogin = {
            email: username,
            password: password
        };

        try {
            const response = await loginEmploye(employeeToLogin);
            // response es un string como "Login OK, Rol: CASHIER"
            const match = response.match(/Rol:\s*(\w+)/i);
            if (match) {
                const role = match[1];
                localStorage.setItem("employeeRole", role);
                alert(`Inicio de sesión exitoso como ${role}`);

                if (role === "ADMIN" || role === "CASHIER" || role === "CHEF") {
                    navigate("/admin/products");
                } else if (role === "DRIVER") {
                    navigate("/admin/orders");
                }
            } else {
                alert("No se pudo obtener el rol del empleado.");
            }
        } catch (error) {
            alert("Error al iniciar sesión.");
            console.error(error);
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
