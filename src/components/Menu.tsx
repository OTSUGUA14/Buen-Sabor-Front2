import React, { useState, useEffect } from 'react';
import styles from '../styles/Menu.module.css'
import type { IProductClient } from '../type/IProductClient';



interface MenuProps {
    products: IProductClient[];
    onProductClick: (product: IProductClient) => void;
}

const Menu: React.FC<MenuProps> = ({ products, onProductClick }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        // Extraemos las categorías de forma única
        const uniqueCategories = Array.from(
            new Set(products.map((product) => product.category.toUpperCase()))
        );
        setCategories(uniqueCategories);

        // Si no hay categoría seleccionada, seleccionamos la primera
        if (!selectedCategory && uniqueCategories.length > 0) {
            setSelectedCategory(uniqueCategories[0]);
        }
    }, [products]);

    const filteredProducts = selectedCategory
        ? products.filter(
            (product) =>
                product.category.toUpperCase() === selectedCategory
        )
        : products;

    const convertUint8ArrayToBase64 = (array: Uint8Array): string => {
        let binary = '';
        const bytes = new Uint8Array(array);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <div className={styles.menuContainer}>
            {/* Barra lateral */}
            <aside className={styles.sidebar}>
                <ul className={styles.categoryList}>
                    {categories.map((category, index) => (
                        <li
                            key={`${category}-${index}`}
                            className={`${styles.categoryListItem} ${selectedCategory === category ? styles.activeCategory : ''}`}
                        >
                            {/* Podés mapear íconos según categoría o poner uno genérico */}
                            <img
                                src={`/icons/${category.toLowerCase()}.svg`}
                                alt={category}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/icons/default.svg';
                                }}
                            />
                            <button
                                className={styles.categoryButton}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>

            </aside>

            {/* Sección principal */}
            <section className={styles.mainSection}>
                {/* Buscador */}
                <div className={styles.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Buscar Plato"
                        className={styles.searchInput}
                    // Podrías agregar un manejador de búsqueda aquí si querés
                    />
                    <img
                        src="/icons/search.svg"
                        alt="Buscar"
                        className={styles.searchIcon}
                    />
                </div>

                {/* Productos */}
                <div className={styles.productSection}>
                    <h2>{selectedCategory}</h2>
                    <div className={styles.productGrid}>
                        {filteredProducts.map((product, index) => (
                            <div
                                key={`${product.id}-${index}`}
                                className={styles.productCard}
                                onClick={() => onProductClick(product)}
                            >
                                {product.inventoryImageDTO && product.inventoryImageDTO.imageData ? (
                                    <img
                                        src={`data:image/png;base64,${convertUint8ArrayToBase64(product.inventoryImageDTO.imageData)}`}
                                        alt={product.name}
                                    />
                                ) : (
                                    <img src="/icons/default.svg" alt="Sin imagen" />
                                )}
                                <p>{product.name}</p>
                                <span>${product.price.toLocaleString('es-AR')}</span>
                            </div>
                        ))}

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Menu;
