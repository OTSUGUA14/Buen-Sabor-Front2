import { useState } from "react";
import styles from "../styles/Login.module.css";

import "../../index.css";
import { regexPatterns } from "../validation/Validatios";
import type { Domicile, UserRegister } from "../types/UserData";
import { registerUser } from "../services/Api";
import { Link } from "react-router-dom";
export interface SimpleDomicile {
    street: string;
    zipCode: string;
    number: number;
    location: number; // solo el id de la location
}
export default function RegisterPage() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        username: "",
        password: "",
        repeat_password: "",
        auth0Id: null,
        userImage: null,
        domiciles: [] as SimpleDomicile[],
    });

    const [domicile, setDomicile] = useState<SimpleDomicile>({
        street: "",
        zipCode: "",
        number: 0,
        location: 1
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));

        const warnings = document.querySelectorAll<HTMLParagraphElement>("p.warning");
        const pattern = regexPatterns[name as keyof typeof regexPatterns];

        // Solo valida si el valor es string y el patrón existe
        if (typeof value === "string" && pattern) {
            if (name === "repeat_password" && value === userData.repeat_password) {
                warnings[7].classList.add("hide");
            } else if (!pattern.test(value)) {
                warnings.forEach((p) => {
                    if (p.dataset.name === name) p.classList.remove("hide");
                });
            } else {
                warnings.forEach((p) => {
                    if (p.dataset.name === name) p.classList.add("hide");
                });
            }
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const keysToValidate = [
            "firstName",
            "lastName",
            "phoneNumber",
            "email",
            "birthDate",
            "username",
            "password",
            "repeat_password",
        ];
        const allValid = keysToValidate.every((key) => {
            console.log(key);

            const value = userData[key as keyof typeof userData];
            const pattern = regexPatterns[key as keyof typeof regexPatterns];
            // Solo valida si value es string y pattern existe
            console.log(value, pattern);

            return pattern && typeof value === "string" ? pattern.test(value) : false;
        });

        const passwordsMatch = userData.password === userData.repeat_password;

        if (!allValid) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        if (!passwordsMatch) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const userToSend: UserRegister = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            birthDate: userData.birthDate,
            username: userData.username,
            password: userData.password,
            auth0Id: userData.auth0Id,
            userImage: userData.userImage,
            domiciles: userData.domiciles,
        };


        await registerUser(userToSend);
    };

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginCard}>
                <h2 className={styles.loginTitle}>REGÍSTRATE</h2>
                <div className={styles.userIconContainer}>
                    <img src="/icons/user-circle.svg" alt="User Icon" className={styles.userIcon} />
                </div>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    {/* firstName */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName" className={styles.inputLabel}>Nombre*</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Juan"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.firstName}
                        />
                        <p className="warning hide" data-name="firstName"># Ingrese un nombre válido</p>
                    </div>

                    {/* lastName */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName" className={styles.inputLabel}>Apellido*</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Pérez"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.lastName}
                        />
                        <p className="warning hide" data-name="lastName"># Ingrese un apellido válido</p>
                    </div>

                    {/* phoneNumber */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber" className={styles.inputLabel}>Teléfono*</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="1234567890"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.phoneNumber}
                        />
                        <p className="warning hide" data-name="phoneNumber"># Ingrese un teléfono válido</p>
                    </div>

                    {/* email */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Correo electrónico*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="ejemplo@email.com"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.email}
                        />
                        <p className="warning hide" data-name="email"># Ingrese un correo válido</p>
                    </div>



                    {/* esto es al pedo pedirlo */}
                    {/* birthDate */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="birthDate" className={styles.inputLabel}>Fecha de Nacimiento*</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.birthDate}
                        />
                        <p className="warning hide" data-name="birthDate"># Ingrese una fecha válida (YYYY-MM-DD)</p>
                    </div>

                    {/* username */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.inputLabel}>Usuario*</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="juanperez"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.username}
                        />
                        <p className="warning hide" data-name="username"># Ingrese un nombre de usuario válido</p>
                    </div>

                    {/* password */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>Contraseña*</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="************"
                            className={styles.loginInput}
                            onChange={handleChange}
                            value={userData.password}
                        />
                        <p className="warning hide" data-name="password"># La contraseña debe tener 8 a 12 dígitos con mayúscula y minúscula</p>
                    </div>

                    {/* repeat_password */}
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
                        <p className="warning hide" data-name="repeat_password"># Las contraseñas deben coincidir</p>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Agregar domicilio</label>
                        <input
                            type="text"
                            placeholder="Calle"
                            className={styles.loginInput}
                            value={domicile.street}
                            onChange={e => setDomicile({ ...domicile, street: e.target.value })}
                        />
                        <input
                            type="number"
                            className={styles.loginInput}
                            placeholder="Número"
                            value={domicile.number}
                            onChange={e => setDomicile({ ...domicile, number: Number(e.target.value) })}
                        />
                        <input
                            type="text"
                            className={styles.loginInput}
                            placeholder="Código Postal"
                            value={domicile.zipCode}
                            onChange={e => setDomicile({ ...domicile, zipCode: e.target.value })}
                        />



                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setUserData(prev => ({
                                ...prev,
                                domiciles: [domicile] // o [...prev.domiciles, domicile] si permites varios
                            }));
                            alert("Domicilio guardado");
                            // Limpia los campos del domicilio
                            setDomicile({
                                street: "",
                                zipCode: "",
                                number: 0,
                                location: 1
                            });
                        }}
                    >
                        Agregar domicilio
                    </button>
                    <button type="submit" className={styles.loginButton}>REGISTRARSE</button>

                    <p className={styles.orSeparator}>O INGRESA CON</p>

                    <button type="button" className={styles.googleLoginButton}>
                        <img src="/icons/google-icon.svg" alt="Google" className={styles.googleIcon} />
                        Entrar con Google
                    </button>

                    <p className={styles.signUpText}>
                        Ya tenes cuenta?{" "}
                        <Link to="/login" className={styles.signUpLink}>
                            Inicia sesion
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
