import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { SaleType, type ISale } from '../api/types/ISale';
import { saleApi } from '../api/sale';
import { FormModal } from '../components/common/FormModal';
import { InputField } from '../components/common/InputField';

import { getProductsAll, getIngredientesAll } from '../utils/Api';
import type { IProduct } from '../api/types/IProduct';
import type { IArticle } from '../api/types/IArticle';

const role = localStorage.getItem("employeeRole");
const isAdmin = role === 'ADMIN';

export const SalesPage: React.FC = () => {
    const {
        data: sales,
        loading,
        error,
        fetchData,
        createItem,
        updateItem,
    } = useCrud<ISale>(saleApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saleToEdit, setSaleToEdit] = useState<ISale | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<{product: IProduct, quantity: number}[]>([]);
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [selectedArticles, setSelectedArticles] = useState<{article: IArticle, quantity: number}[]>([]);

    // Estados para cálculo de precio y descuentos
    const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);

    // Modal de vista (solo lectura)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [saleToView, setSaleToView] = useState<ISale | null>(null);

    const saleTypeLabels: Record<string, string> = {
        HAPPYHOUR: "Hora Feliz",
        SPRINGSALE: "Oferta de Primavera",
        SUMMERSALE: "Oferta de Verano",
        WINTERSALE: "Oferta de Invierno",
        FALLSALE: "Oferta de Otoño",
        CHRISTMASSALE: "Oferta de Navidad"
    };

    // Cargar productos y artículos al montar el componente
    useEffect(() => {
        getProductsAll().then(setProducts);
        getIngredientesAll().then(data => {
            // Solo insumos para venta y habilitados
            setArticles(data.filter((a: IArticle) => a.forSale === true && a.enabled === true));
        });
    }, []);

    // Calcular precios automáticamente cuando cambian productos o descuento
    useEffect(() => {
        let total = 0;
        
        selectedProducts.forEach(item => {
            if (item.product.price) {
                total += item.product.price * item.quantity;
            }
        });

        selectedArticles.forEach(item => {
            if (item.article.buyingPrice) {
                total += item.article.buyingPrice * item.quantity;
            }
        });

        setTotalOriginalPrice(total);
        
        const discountAmount = total * (discount / 100);
        const newFinalPrice = total - discountAmount;
        setFinalPrice(newFinalPrice);
        
        setFormValues(prev => ({
            ...prev,
            salePrice: newFinalPrice
        }));
    }, [selectedProducts, selectedArticles, discount]);

    const saleTypeOptions = Object.values(SaleType).map(type => ({
        value: type,
        label: saleTypeLabels[type] ?? type
    }));

    // Configuración de columnas de la tabla
    const saleColumns: ITableColumn<ISale>[] = [
        { id: 'idsale', label: '#', numeric: true },
        { id: 'denomination', label: 'Nombre' },
        { id: 'saleDescription', label: 'Descripción' },
        { id: 'salePrice', label: 'Precio Final', numeric: true, render: (item) => `$${item.salePrice?.toFixed(2)}` },
        {
            id: 'saleType',
            label: 'Tipo',
            render: (item) => saleTypeLabels[item.saleType] ?? item.saleType
        },
        {
            id: 'saleDetails',
            label: 'Productos',
            render: (item) =>
                Array.isArray(item.saleDetails)
                    ? item.saleDetails
                        .map((detail: any) =>
                            detail.manufacturedArticle?.name
                                ? detail.manufacturedArticle.name
                                : detail.article?.denomination
                        )
                        .filter(Boolean)
                        .join(', ')
                    : '',
        },
        {
            id: 'active',
            label: 'Activa',
            render: (item) => item.active ? 'Sí' : 'No'
        },
        ...(isAdmin
            ? [{
                id: "acciones" as const,
                label: 'Acciones',
                render: (item: ISale) => (
                    <div className="table-actions">
                        <Button variant="actions" onClick={() => handleEdit(item)}>
                            <img src="../../../public/icons/pencil.png" alt="Editar" className="pencil icon"
                                style={{ width: '18px', height: '18px', filter: 'invert(25%) sepia(83%) saturate(7466%) hue-rotate(196deg) brightness(95%) contrast(104%)' }} />
                        </Button>
                        <Button variant="actions" onClick={() => handleView(item)}>
                            <img src="../../../public/icons/eye-on.svg" alt="Ver" className="pencil icon"
                                style={{ width: '18px', height: '18px', filter: 'invert(52%) sepia(94%) saturate(636%) hue-rotate(1deg) brightness(103%) contrast(102%)' }} />
                        </Button>
                    </div>
                ),
            }]
            : [])
    ];

    // Campos del formulario
    const saleFormFields = useMemo(() => [
        {
            name: 'denomination',
            label: 'Nombre',
            type: 'text',
            validation: { required: true, minLength: 3 }
        },
        {
            name: 'saleDescription',
            label: 'Descripción',
            type: 'text',
            validation: { required: true, minLength: 5 }
        },
        {
            name: 'saleType',
            label: 'Tipo de Oferta',
            type: 'select',
            options: saleTypeOptions,
            validation: { required: true }
        },
        {
            name: 'inventoryImage',
            label: 'Imagen',
            type: 'file',
            accept: 'image/*',
        },
    ], [saleTypeOptions]);

    const handleCreate = () => {
        setSaleToEdit(null);
        setFormValues({});
        setImagePreview(null);
        setSelectedProducts([]);
        setSelectedArticles([]);
        setDiscount(0);
        setTotalOriginalPrice(0);
        setFinalPrice(0);
        setIsModalOpen(true);
    };

    const handleView = (sale: ISale) => {
        setSaleToView(sale);
        setIsViewModalOpen(true);
    };

    const handleEdit = (sale: ISale) => {
        // Cargar productos y artículos existentes con sus cantidades
        const manufacturedProducts = sale.saleDetails
            ? sale.saleDetails
                .filter((d: any) => d.manufacturedArticle && d.manufacturedArticle.idmanufacturedArticle)
                .map((d: any) => {
                    const product = products.find(p => p.idmanufacturedArticle === d.manufacturedArticle.idmanufacturedArticle);
                    return product ? { product, quantity: d.quantity || 1 } : null;
                })
                .filter(Boolean)
            : [];

        const promoArticles = sale.saleDetails
            ? sale.saleDetails
                .filter((d: any) => d.article && d.article.idarticle)
                .map((d: any) => {
                    const article = articles.find(a => a.idarticle === d.article.idarticle);
                    return article ? { article, quantity: d.quantity || 1 } : null;
                })
                .filter(Boolean)
            : [];

        setSaleToEdit(sale);
        setFormValues({
            denomination: sale.denomination,
            saleDescription: sale.saleDescription,
            salePrice: sale.salePrice,
            saleType: sale.saleType,
            inventoryImage: null,
            active: sale.active,
            saleDiscount: sale.saleDiscount,
        });
        setSelectedProducts(manufacturedProducts as {product: IProduct, quantity: number}[]);
        setSelectedArticles(promoArticles as {article: IArticle, quantity: number}[]);
        
        if (sale.inventoryImage?.imageData) {
            setImagePreview(`data:image/jpeg;base64,${sale.inventoryImage.imageData}`);
        } else {
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { name } = target;
        let value: any;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const files = target.files;
            value = files && files.length > 0 ? files[0] : null;
            if (value) {
                const reader = new FileReader();
                reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                reader.readAsDataURL(value);
            } else {
                setImagePreview(null);
            }
        } else {
            value = target.value;
        }

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const discountValue = parseFloat(e.target.value) || 0;
        const validDiscount = Math.max(0, Math.min(100, discountValue));
        setDiscount(validDiscount);
        
        setFormValues(prev => ({
            ...prev,
            saleDiscount: validDiscount,
        }));
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFormSubmit = async () => {
        // Validaciones básicas
        const requiredFields = [
            'denomination', 'saleDescription', 'saleType'
        ];
        for (const field of requiredFields) {
            if (!formValues[field] || (typeof formValues[field] === 'string' && formValues[field].trim() === '')) {
                alert(`El campo "${field}" es obligatorio.`);
                return;
            }
        }

        if (selectedProducts.length === 0 && selectedArticles.length === 0) {
            alert('Debe seleccionar al menos un producto o artículo para la promoción.');
            return;
        }

        let inventoryImage = { imageData: '' };
        try {
            if (formValues.inventoryImage) {
                const base64Data = await convertFileToBase64(formValues.inventoryImage);
                inventoryImage = { imageData: base64Data };
            } else if (saleToEdit && saleToEdit.inventoryImage?.imageData) {
                inventoryImage = { imageData: saleToEdit.inventoryImage.imageData };
            }

            // Construir saleDetails para el backend
            const saleDetails = [
                ...selectedProducts.map(item => ({
                    id: item.product.idmanufacturedArticle,
                    quantity: item.quantity,
                    type: "MANUFACTURED"
                })),
                ...selectedArticles.map(item => ({
                    id: item.article.idarticle,
                    quantity: item.quantity,
                    type: "ARTICLE"
                }))
            ];

            const newSale: any = {
                denomination: formValues.denomination,
                saleDescription: formValues.saleDescription,
                saleType: formValues.saleType,
                isActive: formValues.active ?? true,
                saleDiscount: discount,
                inventoryImage,
                saleDetails,
            };

            if (saleToEdit) {
                newSale.idsale = saleToEdit.idsale;
                await updateItem(newSale);
            } else {
                await createItem(newSale);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Error al procesar el formulario.');
            console.error(error);
        }
    };

    // Renderizado
    if (loading && sales.length === 0) return <p>Cargando ofertas...</p>;
    if (error) return <p className="error-message">Error al cargar ofertas: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>
                        Nueva promoción
                    </Button>
                )}
            </div>

            <GenericTable
                data={sales.map(sale => ({ ...sale, id: sale.idsale }))}
                columns={saleColumns}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={saleToEdit ? 'Editar Oferta' : 'Crear Oferta'}
                onSubmit={handleFormSubmit}
            >
                {saleFormFields.map(field => {
                    const isFileInput = field.type === 'file';
                    return (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type as any}
                            onChange={handleInputChange}
                            options={field.type === 'select' ? field.options || [] : undefined}
                            {...(!isFileInput ? { value: formValues[field.name] ?? '' } : {})}
                        />
                    );
                })}

                {imagePreview && (
                    <div style={{ marginBottom: 16 }}>
                        <label>Vista previa de la imagen:</label>
                        <img
                            src={imagePreview}
                            alt="Vista previa"
                            style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                        />
                    </div>
                )}

                {/* Gestión de productos */}
                <div style={{ marginBottom: 16 }}>
                    <label>Productos en la promo:</label>
                    {selectedProducts.map((item, idx) => (
                        <div key={`${item.product.idmanufacturedArticle}-${idx}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: '8px' }}>
                            <span style={{ flex: 1 }}>{item.product.name} - ${item.product.price?.toFixed(2)}</span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    setSelectedProducts(selectedProducts.map((p, i) => 
                                        i === idx ? { ...p, quantity: newQuantity } : p
                                    ));
                                }}
                                style={{ width: '60px', padding: '4px' }}
                            />
                            <span>${((item.product.price || 0) * item.quantity).toFixed(2)}</span>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => setSelectedProducts(selectedProducts.filter((_, i) => i !== idx))}
                            >
                                Quitar
                            </Button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 8 }}>
                        <select
                            style={{ flex: 1 }}
                            defaultValue=""
                            onChange={e => {
                                const product = products.find(p => p.idmanufacturedArticle === Number(e.target.value));
                                if (product) {
                                    setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
                                }
                                e.target.value = "";
                            }}
                        >
                            <option value="" disabled>Agregar producto...</option>
                            {products.map(p => (
                                <option key={p.idmanufacturedArticle} value={p.idmanufacturedArticle}>
                                    {p.name} - ${p.price?.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Gestión de artículos */}
                <div style={{ marginBottom: 16 }}>
                    <label>Artículos en la promo:</label>
                    {selectedArticles.map((item, idx) => (
                        <div key={`${item.article.idarticle}-${idx}`} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: '8px' }}>
                            <span style={{ flex: 1 }}>{item.article.denomination} - ${item.article.buyingPrice?.toFixed(2)}</span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    setSelectedArticles(selectedArticles.map((a, i) => 
                                        i === idx ? { ...a, quantity: newQuantity } : a
                                    ));
                                }}
                                style={{ width: '60px', padding: '4px' }}
                            />
                            <span>${((item.article.buyingPrice || 0) * item.quantity).toFixed(2)}</span>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => setSelectedArticles(selectedArticles.filter((_, i) => i !== idx))}
                            >
                                Quitar
                            </Button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 8 }}>
                        <select
                            style={{ flex: 1 }}
                            defaultValue=""
                            onChange={e => {
                                const article = articles.find(a => a.idarticle === Number(e.target.value));
                                if (article) {
                                    setSelectedArticles([...selectedArticles, { article, quantity: 1 }]);
                                }
                                e.target.value = "";
                            }}
                        >
                            <option value="" disabled>Agregar artículo...</option>
                            {articles.map(a => (
                                <option key={a.idarticle} value={a.idarticle}>
                                    {a.denomination} - ${a.buyingPrice?.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Cálculo de precios y descuentos */}
                <div style={{ marginBottom: 16, padding: '16px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                    <h4>Cálculo de Precio</h4>
                    <div style={{ marginBottom: 8 }}>
                        <strong>Precio Original Total: ${totalOriginalPrice.toFixed(2)}</strong>
                    </div>
                    
                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label>Descuento (%):</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={discount}
                            onChange={handleDiscountChange}
                            style={{ width: '100px', padding: '4px' }}
                            placeholder="10"
                        />
                        <span>({discount}% de descuento)</span>
                    </div>
                    
                    <div style={{ marginBottom: 8, color: '#666' }}>
                        <span>Descuento aplicado: ${(totalOriginalPrice * (discount / 100)).toFixed(2)}</span>
                    </div>
                    
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2196F3' }}>
                        <strong>Precio Final: ${finalPrice.toFixed(2)}</strong>
                    </div>
                </div>

                {/* Campo para estado activa/inactiva */}
                <div style={{ marginBottom: 16 }}>
                    <label>Estado de la promoción:</label>
                    <select
                        name="active"
                        value={formValues.active ?? true}
                        onChange={e => {
                            const value = e.target.value === "true";
                            setFormValues(prev => ({
                                ...prev,
                                active: value
                            }));
                        }}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    >
                        <option value="true">Activa</option>
                        <option value="false">Inactiva</option>
                    </select>
                </div>

                <Button variant="primary" type="submit">
                    {saleToEdit ? 'Actualizar' : 'Crear'}
                </Button>
            </FormModal>

            {/* Modal de vista (solo lectura) */}
            <FormModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalle de la Promoción"
                onSubmit={undefined}
            >
                {saleToView && (
                    <>
                        <InputField
                            label="Nombre"
                            name="denomination"
                            type="text"
                            value={saleToView.denomination ?? ''}
                            disabled
                        />
                        <InputField
                            label="Descripción"
                            name="saleDescription"
                            type="text"
                            value={saleToView.saleDescription ?? ''}
                            disabled
                        />
                        <InputField
                            label="Precio Final"
                            name="salePrice"
                            type="number"
                            value={saleToView.salePrice?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Tipo de Oferta"
                            name="saleType"
                            type="text"
                            value={saleTypeLabels[saleToView.saleType] ?? saleToView.saleType}
                            disabled
                        />
                        <InputField
                            label="Estado"
                            name="active"
                            type="text"
                            value={saleToView.active ? 'Activa' : 'Inactiva'}
                            disabled
                        />
                        {saleToView.inventoryImage?.imageData && (
                            <div style={{ marginBottom: 16 }}>
                                <label>Imagen de la promoción:</label>
                                <img
                                    src={`data:image/jpeg;base64,${saleToView.inventoryImage.imageData}`}
                                    alt="Imagen de la promoción"
                                    style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: 16 }}>
                            <label>Productos en la promo:</label>
                            <ul>
                                {saleToView.saleDetails?.map((detail, idx) => (
                                    <li key={idx}>
                                        {detail.manufacturedArticle?.name ||
                                            detail.article?.denomination ||
                                            'Sin nombre'} - Cantidad: {detail.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </FormModal>

        </div>
    );
};