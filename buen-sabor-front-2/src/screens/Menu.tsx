import styles from '../styles/Menu.module.css';

export default function Menu() {
    return (
        <main className={styles.menuContainer}>
            {/* Categorías */}
            <aside className={styles.sidebar}>
                <ul className={styles.categoryList}>
                    {/* Envuelve el img y el button en un li individual para controlar el espaciado */}
                    <li className={styles.categoryListItem}>
                        <img src="/icons/burger.svg" alt="Hamburguesas" />
                        <button className={styles.categoryButton}>HAMBURGUESAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/pizza.svg" alt="Pizzas" />
                        <button className={styles.categoryButton}>PIZZAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/empanada.svg" alt="Empanadas" />
                        <button className={styles.categoryButton}>EMPANADAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/salad.svg" alt="Ensaladas" />
                        <button className={styles.categoryButton}>ENSALADAS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/fries.svg" alt="Acompañamientos" />
                        <button className={styles.categoryButton}>ACOMPAÑAMIENTOS</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/dessert.svg" alt="Postres" />
                        <button className={styles.categoryButton}>POSTRES</button>
                    </li>
                    <li className={styles.categoryListItem}>
                        <img src="/icons/drink.svg" alt="Bebidas" />
                        <button className={styles.categoryButton}>BEBIDAS</button>
                    </li>
                </ul>
            </aside>

            {/* Sección principal */}
            <section className={styles.mainSection}>
                {/* Buscador */}
                <div className={styles.searchBarContainer}>
                    <input type="text" placeholder="Buscar Plato" className={styles.searchInput} />
                    <img src="/icons/search.svg" alt="Buscar" className={styles.searchIcon} />
                </div>

                {/* Productos */}
                <div className={styles.productSection}>
                    <h2>HAMBURGUESAS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa1.png" alt="Clasica" />
                            <p>CLÁSICA DE LA CASA</p>
                            <span>$8.000</span>
                        </div>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa2.png" alt="Bacon" />
                            <p>BACON Y HUEVO</p>
                            <span>$12.000</span>
                        </div>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa3.png" alt="Cebolla y Bacon" />
                            <p>CEBOLLA Y BACON</p>
                            <span>$9.700</span>
                        </div>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa4.png" alt="Pollo Crispy Simple" />
                            <p>POLLO CRISPY SIMPLE</p>
                            <span>$8.000</span>
                        </div>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa5.png" alt="Pollo Cebolla y Bacon" />
                            <p>POLLO CEBOLLA Y BACON</p>
                            <span>$9.500</span>
                        </div>
                        <div className={styles.productCard}>
                            <img src="/productos/hamburguesa6.png" alt="Vegana Simple" />
                            <p>VEGANA SIMPLE</p>
                            <span>$8.400</span>
                        </div>
                    </div>

                    <h2>PIZZAS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/pizza1.png" alt="Muzzarella" />
                            <p>MUZZARELLA</p>
                            <span>$6.000</span>
                        </div>
                        {/* Agrega más pizzas aquí si tienes imágenes */}
                    </div>

                    <h2>EMPANADAS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/empanada1.png" alt="Carne" />
                            <p>CARNE</p>
                            <span>$1.200</span>
                        </div>
                        {/* Agrega más empanadas aquí */}
                    </div>

                    <h2>ENSALADAS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/ensalada1.png" alt="Caesar" />
                            <p>CAESAR</p>
                            <span>$7.500</span>
                        </div>
                        {/* Agrega más ensaladas aquí */}
                    </div>

                    <h2>ACOMPAÑAMIENTOS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/acompanamiento1.png" alt="Papas Fritas" />
                            <p>PAPAS FRITAS</p>
                            <span>$3.000</span>
                        </div>
                        {/* Agrega más acompañamientos aquí */}
                    </div>

                    <h2>POSTRES</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/postre1.png" alt="Helado" />
                            <p>HELADO</p>
                            <span>$2.500</span>
                        </div>
                        {/* Agrega más postres aquí */}
                    </div>

                    <h2>BEBIDAS</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productCard}>
                            <img src="/productos/bebida1.png" alt="Gaseosa" />
                            <p>GASEOSA</p>
                            <span>$1.800</span>
                        </div>
                        {/* Agrega más bebidas aquí */}
                    </div>

                </div>
            </section>

            {/* Carrito */}
            <aside className={styles.cartSidebar}>
                <h3>TU PEDIDO</h3>
                <div className={styles.emptyCart}>
                    <img src="/icons/empty-cart.svg" alt="carrito vacío" />
                    <p>Tu carrito está vacío</p>
                </div>
            </aside>
        </main>
    );
}