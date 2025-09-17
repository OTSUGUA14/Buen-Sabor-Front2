import { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import "../../index.css";
import { regexPatterns } from "../validation/Validatios";
import type { Domicile, UserRegister } from "../types/UserData";
import { registerUser, getLocations } from "../services/Api";
import { Link } from "react-router-dom";

interface Location {
    idlocation: number;
    name: string;
    province: {
        name: string;
        idprovince: number;
        country: {
            name: string;
            idcountry: number;
        };
    };
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
        domiciles: [] as Domicile[],
    });

    const [locations, setLocations] = useState<Location[]>([]);
    const [domicile, setDomicile] = useState<Domicile>({
        street: "",
        zipcode: "",
        number: 0,
        location: {
            name: "",
            province: {
                name: "",
                idprovince: 1,
                country: {
                    name: "",
                    idcountry: 1,
                },
            },
            idlocation: 1,
        },
        iddomicile: 0,
    });

    useEffect(() => {
        getLocations().then((data) => setLocations(data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));

        const warnings = document.querySelectorAll<HTMLParagraphElement>("p.warning");
        const pattern = regexPatterns[name as keyof typeof regexPatterns];

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

    const handleDomicileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "location") {
            const selectedId = Number(value);
            const selectedLoc = locations.find((l) => l.idlocation === selectedId);
            setDomicile((prev) => ({
                ...prev,
                location: selectedLoc
                    ? {
                        name: selectedLoc.name,
                        idlocation: selectedLoc.idlocation,
                        province: {
                            name: selectedLoc.province.name,
                            idprovince: selectedLoc.province.idprovince,
                            country: {
                                name: selectedLoc.province.country.name,
                                idcountry: selectedLoc.province.country.idcountry,
                            },
                        },
                    }
                    : prev.location,
            }));
        } else {
            setDomicile((prev) => ({
                ...prev,
                [name]: name === "number" ? Number(value) : value,
            }));
        }
    };

    const handleSaveDomicile = () => {
        if (
            !domicile.street ||
            !domicile.zipcode ||
            !domicile.number ||
            !domicile.location.idlocation
        ) {
            alert("Completa todos los campos del domicilio.");
            return;
        }
        setUserData((prev) => ({
            ...prev,
            domiciles: [domicile], // O [...prev.domiciles, domicile] si permitís varios
        }));
        alert("Domicilio guardado");
        setDomicile({
            street: "",
            zipcode: "",
            number: 0,
            location: locations[0]
                ? {
                    name: locations[0].name,
                    idlocation: locations[0].idlocation,
                    province: {
                        name: locations[0].province.name,
                        idprovince: locations[0].province.idprovince,
                        country: {
                            name: locations[0].province.country.name,
                            idcountry: locations[0].province.country.idcountry,
                        },
                    },
                }
                : {
                    name: "",
                    idlocation: 1,
                    province: {
                        name: "",
                        idprovince: 1,
                        country: {
                            name: "",
                            idcountry: 1,
                        },
                    },
                },
            iddomicile: 0,
        });
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
            const value = userData[key as keyof typeof userData];
            const pattern = regexPatterns[key as keyof typeof regexPatterns];
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

        if (userData.domiciles.length === 0) {
            alert("Debes agregar al menos un domicilio.");
            return;
        }

        // Transforma domicilios para que location sea solo el id
        const domicilesToSend = userData.domiciles.map((d) => ({
            street: d.street,
            zipcode: d.zipcode,
            number: d.number,
            location: d.location.idlocation,
        }));

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
            domiciles: domicilesToSend,
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
                        <label htmlFor="username" className={styles.inputLabel}>Nombre de usuario*</label>
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

                    {/* Domicilio */}
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Agregar domicilio</label>
                        <input
                            type="text"
                            name="street"
                            placeholder="Calle"
                            className={styles.loginInput}
                            value={domicile.street}
                            onChange={handleDomicileChange}
                        />
                        <input
                            type="number"
                            name="number"
                            className={styles.loginInput}
                            placeholder="Número"
                            value={domicile.number}
                            onChange={handleDomicileChange}
                        />
                        <input
                            type="text"
                            name="zipcode"
                            className={styles.loginInput}
                            placeholder="Código Postal"
                            value={domicile.zipcode}
                            onChange={handleDomicileChange}
                        />
                        <select
                            name="location"
                            className={styles.loginInput}
                            value={domicile.location.idlocation}
                            onChange={handleDomicileChange}
                        >
                            <option value="">Selecciona una localidad</option>
                            {locations.map((loc) => (
                                <option key={loc.idlocation} value={loc.idlocation}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        className={styles["btn-guardar-domicilio"]}
                        onClick={handleSaveDomicile}
                    >
                        Guardar Domicilio
                    </button>

                    <p className={styles.orSeparator}>O INGRESA CON</p>

                    <button
                        type="button"
                        className={styles.googleLoginButton}
                        onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                    >
                        <img src="../public/icons/icons8-logo-de-google-48.svg" alt="Google" className={styles.googleIcon} />
                        Entrar con Google
                    </button>

                    <button type="submit" className={styles.loginButton}>REGISTRARSE</button>

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