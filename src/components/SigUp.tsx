import { useState } from "react";
import styles from "../styles/Login.module.css";
import { valueRegex } from "../validation/ValueRegistro";
import { regexPatterns, validation } from "../validation/Validatios";

import "../index.css";

export default function SignUp() {
    const [userData, setUserData] = useState({
        name: "",
        phone_number: "",
        sign_up_email: "",
        addresses: "",
        passWord: "",
        repeat_password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
        const warnings = document.querySelectorAll<HTMLParagraphElement>("p.warning");
        validation(name as keyof typeof valueRegex, value, warnings);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que todos los campos pasen el regex
        const keysToValidate = ["name", "phone_number", "sign_up_email", "addresses", "passWord", "repeat_password"];
        const allValid = keysToValidate.every((key) => {
            const value = userData[key as keyof typeof userData];
            const pattern = regexPatterns[key as keyof typeof regexPatterns];
            return pattern ? pattern.test(value) : false;
        });


        // Validar que passWord y repeat_password coincidan
        const passwordsMatch = userData.passWord === userData.repeat_password;

        if (!allValid) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        if (!passwordsMatch) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        alert("Usuario registrado correctamente");
        localStorage.setItem("Users", JSON.stringify([{ ...userData, state: true }]));
        window.location.href = "menu.html";
    };

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>REGÍSTRATE</h2>
                <div className={styles.userIconContainer}>
                    <img src="/icons/user-circle.svg" alt="User Icon" className={styles.userIcon} />
                </div>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.inputLabel}>Nombre*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Juan Perez"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.name}
                        />
                        <p className="warning hide" data-name="name"># Ingrese un nombre valido</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phone_number" className={styles.inputLabel}>Número de teléfono*</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            placeholder="1234567890"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.phone_number}
                        />
                        <p className="warning hide" data-name="phone_number"># Ingrese un número de teléfono valido</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="sign_up_email" className={styles.inputLabel}>Correo electrónico*</label>
                        <input
                            type="email"
                            id="sign_up_email"
                            name="sign_up_email"
                            placeholder="ejemplo@email.com"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.sign_up_email}
                        />
                        <p className="warning hide" data-name="sign_up_email"># Ingrese un correo valido</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="addresses" className={styles.inputLabel}>Dirección*</label>
                        <input
                            type="text"
                            id="addresses"
                            name="addresses"
                            placeholder="Av. Siempre Viva 123"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.addresses}
                        />
                        <p className="warning hide" data-name="addresses"># Ingrese una dirrección valida</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="passWord" className={styles.inputLabel}>Contraseña*</label>
                        <input
                            type="password"
                            id="passWord"
                            name="passWord"
                            placeholder="************"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.passWord}
                        />
                        <p className="warning hide" data-name="passWord"># La contraseña debe tener 8 a 12 dígitos y una mayusculas y una minusculas por lo menos</p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="repeat_password" className={styles.inputLabel}>Repetir contraseña*</label>
                        <input
                            type="password"
                            id="repeat_password"
                            name="repeat_password"
                            placeholder="************"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.repeat_password}
                        />
                        <p className="warning hide" data-name="repeat_password"># Tiene que ser igual que la contraseña</p>
                    </div>

                    <button type="submit" className={styles.loginButton}>REGISTRARSE</button>

                    <p className={styles.orSeparator}>O REGÍSTRATE CON</p>
                    <button type="button" className={styles.googleLoginButton}>
                        <img src="/icons/google-icon.svg" alt="Google" className={styles.googleIcon} />
                        Entrar con Google
                    </button>

                    <p className={styles.signUpText}>
                        Ya tienes cuenta? <a href="/Login" className={styles.signUpLink}>Iniciar sesión</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
