import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { SaleType, type ISale } from '../api/types/ISale';
import { saleApi } from '../api/sale';
import { FormModal } from '../components/common/FormModal';
import { InputField } from '../components/common/InputField';

import { getProductsAll, getIngredientesAll } from '../utils/Api'; // Ajusta la ruta si es necesario
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
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [selectedArticles, setSelectedArticles] = useState<IArticle[]>([]);
    // Mapa de traducción para SaleType

    const saleTypeLabels: Record<string, string> = {
        HAPPYHOUR: "Hora Feliz",
        SPRINGSALE: "Oferta de Primavera",
        SUMMERSALE: "Oferta de Verano",
        WINTERSALE: "Oferta de Invierno",
        FALLSALE: "Oferta de Otoño",
        CHRISTMASSALE: "Oferta de Navidad"
    };
    useEffect(() => {
        getProductsAll().then(setProducts);
        getIngredientesAll().then(data => {
            setArticles(data.filter((a: IArticle) => a.forSale));
        });
    }, []);

    // Opciones para el select de tipo de oferta
    const saleTypeOptions = Object.values(SaleType).map(type => ({
        value: type,
        label: saleTypeLabels[type] ?? type
    }));

    // Opciones para el select de productos
    const productOptions = useMemo(() =>
        products
            .filter(prod => typeof prod.idmanufacturedArticle === 'number')
            .map(prod => ({
                value: prod.idmanufacturedArticle as number,
                label: prod.name
            })),
        [products]);

    // Columnas de la tabla
    const saleColumns: ITableColumn<ISale>[] = [
        { id: 'idsale', label: '#', numeric: true },
        { id: 'denomination', label: 'Nombre' },
        { id: 'saleDescription', label: 'Descripción' },
        { id: 'salePrice', label: 'Precio Oferta', numeric: true, render: (item) => `$${item.salePrice}` },
        {
            id: 'saleType',
            label: 'Tipo',
            render: (item) => saleTypeLabels[item.saleType] ?? item.saleType
        },
        { id: 'startDate', label: 'Fecha Inicio' },
        { id: 'endDate', label: 'Fecha Fin' },
        { id: 'startTime', label: 'Hora Inicio' },
        { id: 'endTime', label: 'Hora Fin' },
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
        ...(isAdmin
            ? [{
                id: "acciones" as const,
                label: 'Acciones',
                render: (item: ISale) => (
                    <div className="table-actions">
                        <Button variant="secondary" onClick={() => handleEdit(item)}>Editar</Button>
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
            type: 'textarea',
            validation: { required: true, minLength: 5 }
        },
        {
            name: 'salePrice',
            label: 'Precio Oferta',
            type: 'number',
            validation: { required: true, min: 0 }
        },
        {
            name: 'saleType',
            label: 'Tipo de Oferta',
            type: 'select',
            options: saleTypeOptions,
            validation: { required: true }
        },
        {
            name: 'startDate',
            label: 'Fecha Inicio',
            type: 'date',
            validation: { required: true }
        },
        {
            name: 'endDate',
            label: 'Fecha Fin',
            type: 'date',
            validation: { required: true }
        },
        {
            name: 'startTime',
            label: 'Hora Inicio',
            type: 'time',
            validation: { required: true }
        },
        {
            name: 'endTime',
            label: 'Hora Fin',
            type: 'time',
            validation: { required: true }
        },
        {
            name: 'inventoryImage',
            label: 'Imagen',
            type: 'file',
            accept: 'image/*',
        },

    ], [saleTypeOptions, productOptions]);

    // Handlers
    const handleCreate = () => {
        setSaleToEdit(null);
        setFormValues({});
        setImagePreview(null);
        setSelectedProducts([]);
        setIsModalOpen(true);
    };

    const handleEdit = (sale: ISale) => {
        // Para productos
        const manufacturedProducts = sale.saleDetails
            ? sale.saleDetails
                .filter((d: any) => d.manufacturedArticle && d.manufacturedArticle.idmanufacturedArticle)
                .map((d: any) => products.find(p => p.idmanufacturedArticle === d.manufacturedArticle.idmanufacturedArticle))
                .filter(Boolean)
            : [];

        // Para artículos
        const promoArticles = sale.saleDetails
            ? sale.saleDetails
                .filter((d: any) => d.article && d.article.idarticle)
                .map((d: any) => articles.find(a => a.idarticle === d.article.idarticle))
                .filter(Boolean)
            : [];

        setSaleToEdit(sale);
        setFormValues({
            denomination: sale.denomination,
            saleDescription: sale.saleDescription,
            salePrice: sale.salePrice,
            saleType: sale.saleType,
            startDate: sale.startDate,
            endDate: sale.endDate,
            startTime: sale.startTime,
            endTime: sale.endTime,
            inventoryImage: null,
        });
        setSelectedProducts(manufacturedProducts as IProduct[]);
        setSelectedArticles(promoArticles as IArticle[]);
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
        } else if (target instanceof HTMLSelectElement && target.multiple) {
            value = Array.from(target.options)
                .filter(option => option.selected)
                .map(option => Number(option.value));
        } else {
            value = target.value;
        }

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    // Convertir File a Base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]); // Solo la parte base64
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFormSubmit = async () => {
        // Validar campos requeridos
        const requiredFields = [
            'denomination', 'saleDescription', 'salePrice', 'saleType',
            'startDate', 'endDate', 'startTime', 'endTime'
        ];
        for (const field of requiredFields) {
            if (!formValues[field] || (typeof formValues[field] === 'string' && formValues[field].trim() === '')) {
                alert(`El campo "${field}" es obligatorio.`);
                return;
            }
        }

        let inventoryImage = { imageData: '' };
        try {
            if (formValues.inventoryImage) {
                const base64Data = await convertFileToBase64(formValues.inventoryImage);
                inventoryImage = { imageData: base64Data };
            } else if (saleToEdit && saleToEdit.inventoryImage?.imageData) {
                inventoryImage = { imageData: saleToEdit.inventoryImage.imageData };
            }

            // Construir saleDetails
            const saleDetails = [
                ...selectedProducts.map(p => ({
                    id: p.idmanufacturedArticle,
                    quantity: 1, // Puedes cambiar esto si quieres permitir editar la cantidad
                    type: "MANUFACTURED"
                })),
                ...selectedArticles.map(a => ({
                    id: a.idarticle,
                    quantity: 1, // Puedes cambiar esto si quieres permitir editar la cantidad
                    type: "ARTICLE"
                }))
            ];

            const newSale: any = {
                denomination: formValues.denomination,
                saleDescription: formValues.saleDescription,
                salePrice: parseFloat(formValues.salePrice),
                saleType: formValues.saleType,
                startDate: formValues.startDate,
                endDate: formValues.endDate,
                startTime: formValues.startTime,
                endTime: formValues.endTime,
                isActive: true,
                inventoryImage,
                saleDetails,
            };
            console.log(newSale);

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
            {/* <div className="page-header">
                <h2>PROMOCIONES</h2>
            </div> */}
            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>
                        Nueva promocion
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

                {/* Previsualización de la imagen */}
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

                {/* Productos de la promo */}
                <div style={{ marginBottom: 16 }}>
                    <label>Productos en la promo:</label>
                    {selectedProducts.map((prod, idx) => (
                        <div key={prod.idmanufacturedArticle} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ marginRight: 8 }}>{prod.name}</span>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => setSelectedProducts(selectedProducts.filter((_, i) => i !== idx))}
                            >
                                Quitar
                            </Button>
                        </div>
                    ))}
                    <select
                        style={{ marginRight: 8, marginTop: 8 }}
                        defaultValue=""
                        onChange={e => {
                            const prod = products.find(p => p.idmanufacturedArticle === Number(e.target.value));
                            if (prod && !selectedProducts.some(p => p.idmanufacturedArticle === prod.idmanufacturedArticle)) {
                                setSelectedProducts([...selectedProducts, prod]);
                            }
                            e.target.value = "";
                        }}
                    >
                        <option value="" disabled>Agregar producto...</option>
                        {products
                            .filter(p => !selectedProducts.some(sp => sp.idmanufacturedArticle === p.idmanufacturedArticle))
                            .map(p => (
                                <option key={p.idmanufacturedArticle} value={p.idmanufacturedArticle}>
                                    {p.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Artículos de la promo */}
                <div style={{ marginBottom: 16 }}>
                    <label>Artículos en la promo:</label>
                    {selectedArticles.map((art, idx) => (
                        <div key={art.idarticle} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ marginRight: 8 }}>{art.denomination}</span>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => setSelectedArticles(selectedArticles.filter((_, i) => i !== idx))}
                            >
                                Quitar
                            </Button>
                        </div>
                    ))}
                    <select
                        style={{ marginRight: 8, marginTop: 8 }}
                        defaultValue=""
                        onChange={e => {
                            const art = articles.find(a => a.idarticle === Number(e.target.value));
                            if (art && !selectedArticles.some(a => a.idarticle === art.idarticle)) {
                                setSelectedArticles([...selectedArticles, art]);
                            }
                            e.target.value = "";
                        }}
                    >
                        <option value="" disabled>Agregar artículo...</option>
                        {articles
                            .filter(a => !selectedArticles.some(sa => sa.idarticle === a.idarticle))
                            .map(a => (
                                <option key={a.idarticle} value={a.idarticle}>
                                    {a.denomination}
                                </option>
                            ))}
                    </select>
                </div>

                <Button variant="primary" type="submit">
                    {saleToEdit ? 'Actualizar' : 'Crear'}
                </Button>
            </FormModal>
        </div>
    );
};