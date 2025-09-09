import { useEffect, useState } from 'react';
import styles from '../styles/Menu.module.css';
import type { Category, IProductClient } from '../types/IProductClient';
import { getCategopryAll } from '../services/Api';

interface MenuProps {
    products: IProductClient[];
    onProductClick: (product: IProductClient) => void;
}

const Menu: React.FC<MenuProps> = ({ products, onProductClick }) => {
    const [categories, setCategories] = useState<Category[]>([]); 
    //Estado para la barra de búsqueda
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allCategories = await getCategopryAll();
                // Agrega la categoría "Promociones" si no existe
                const promoCategory = { idcategory: 999, name: "Promociones", forSale: true, enabled: true };
                const categoriesWithPromo = [
                    promoCategory,
                    ...allCategories.filter(cat => cat.forSale && cat.enabled) // <-- SOLO para venta y activas
                ];
                setCategories(categoriesWithPromo);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className={styles.menuContainer}>
            {/* Barra lateral con scroll */}
            <aside className={styles.sidebar}>
                <ul className={styles.categoryList}>
                    <h2>CATEGORÍAS</h2>
                    {categories
                        .filter((category) => category.forSale && category.enabled) // <-- SOLO para venta y activas
                        .map((category) => (
                            <li key={category.idcategory} className={styles.categoryListItem}>
                                <a href={`#cat-${category.idcategory}`} className={styles.categoryButton}>
                                    {category.name}
                                </a>
                            </li>
                        ))}
                </ul>
            </aside>

            {/* Sección principal con todas las categorías visibles */}
            <section className={styles.mainSection}>
                <div className={styles.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Buscar Plato"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img
                        src="/icons/search.svg"
                        alt="Buscar"
                        className={styles.searchIcon}
                    />
                </div>
                {/* Mostrar todas las categorías con sus productos */}
                {categories
                    .filter((category) => category.forSale && category.enabled) 
                    .map((category) => {
                        const categoryProducts = products.filter(
                            (product) =>
                                product.category?.idcategory === category.idcategory &&
                                product.isAvailable &&
                                product.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        if (categoryProducts.length === 0) return null;

                        return (
                            <div
                                key={category.idcategory}
                                id={`cat-${category.idcategory}`}
                                className={styles.categorySection}
                            >
                                <h2 className={styles.categoryTitle}>{category.name}</h2>
                                <div className={styles.productGrid}>
                                    {categoryProducts.map((product, index) => (
                                        <div
                                            key={`${product.id}-${index}`}
                                            className={styles.productCard}
                                            onClick={() => onProductClick(product)}
                                        >
                                            <img
                                                src={`data:image/png;base64,${product.manufacInventoryImage.imageData}`}
                                                alt={product.name}
                                            />
                                            <p>{product.name}</p>
                                            <span>
                                                {product.price != null
                                                    ? `$${product.price.toLocaleString('es-AR')}`
                                                    : 'Precio no disponible'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </section>
        </div>
    );
};

export default Menu;
