import styles from '../styles/Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <section className={styles.footerContent}>
                <p className={styles.logo}>
                    Buen<span className={styles.logoHighlight}>SABOR</span>
                </p>
                <div className={styles.footerInfo}>
                    <div className={styles.infoItem}>
                        <img src="/IMAGENES BUEN SABOR/MAIN/telefono.png" alt="teléfono" className={styles.icon} />
                        +54 9 261 123 4567
                    </div>
                    <div className={styles.infoItem}>
                        <img src="/IMAGENES BUEN SABOR/MAIN/ubi.png" alt="ubicación" className={styles.icon} />
                        Cnel. Rodriguez 273, Ciudad, Mendoza
                    </div>
                    <div className={styles.infoItem}>
                        <img src="/IMAGENES BUEN SABOR/MAIN/relojFooter.png" alt="horario" className={styles.icon} />
                        Lunes a Viernes, 9 AM - 9 PM
                    </div>
                </div>
            </section>
        </footer>
    );
}
