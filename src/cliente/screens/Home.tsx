import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { fetchAndStoreOAuthUser } from "../services/Api";

export default function Home() {
    // useEffect(() => {

    //     // Si tienes una forma de saber que el usuario volvió de Google, llama a la función:
    //     // Por ejemplo, si hay un query param como ?oauth2=success

  

    //         fetchAndStoreOAuthUser();
        

    // }, []);
    return (
        <>
            <section className={styles.homeSection}>
                {/* LADO IZQUIERDO */}
                <div className={styles.leftContent}>
                    <h1 className={styles.mainTitle}>
                        Reinventamos <span className={styles.orangeText}>LA RUEDA</span><br />
                        para darle <span className={styles.orangeText}>BUEN SABOR</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Un plato para cada antojo, un sabor para cada día
                    </p>
                    <button
                        className={styles.menuButton}
                        onClick={() => (window.location.href = '/menu')}
                    >
                        IR AL MENÚ
                    </button>

                </div>

                {/* LADO DERECHO */}
                <div className={styles.rightContent}>
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/fondo.png"
                        alt="fondo"
                        className={`${styles.fondoNaranja}`}
                    />
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/pala-pizzera.png"
                        alt="pala"
                        className={styles.pala}
                    />
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/pizza rueda2.webp"
                        alt="Pizza"
                        className={styles.pizza}
                    />
                </div>
            </section>

            <main className={styles.mainContent}>
                <section id="taste" className={styles.section}>
                    <div className={styles.sectionText}>
                        <h2 className={styles.sectionTitle}>
                            Descubre el verdadero significado de <span>BUEN SABOR</span>
                        </h2>
                        <p className={styles.sectionParagraph}>
                            En Buen Sabor no solo cocinamos, creamos experiencias. Cada plato está hecho con ingredientes frescos, recetas con historia y un toque de pasión que se nota en cada bocado. Para nosotros, el "buen sabor" no es solo el nombre de nuestro restaurante, es una promesa que cumplimos en cada mesa, todos los días
                        </p>
                    </div>
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/verdadero-sabor.png"
                        alt="chica comiendo hamburguesa"
                        className={styles.sectionImage}
                    />
                </section>

                <section id="about-us" className={styles.section}>
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/nosotros.png"
                        alt="nosotros"
                        className={styles.aboutImage}
                    />
                    <div className={styles.sectionText}>
                        <h2 className={styles.sectionTitle}>
                            SOBRE NOSOTROS
                        </h2>
                        <p className={styles.sectionParagraph}>
                            En Buen Sabor, creemos que la comida tiene el poder de unir, emocionar y crear recuerdos. Nacimos con la idea de ofrecer platos llenos de autenticidad, preparados con ingredientes frescos y mucho cariño. Somos un equipo apasionado por la cocina y por brindar un servicio que te haga sentir como en casa. Cada detalle, desde el menú hasta el ambiente, está pensado para que vivas una experiencia única. Porque para nosotros, la verdadera sazón está en compartir.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}
