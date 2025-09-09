// src/administracion-sistema/pages/ProductsPage/ProductsPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { productApi } from '../api/product';
import type { Category, InventoryImage, IProduct, ManufacturedArticleDetail } from '../api/types/IProduct';
import { FormModal } from '../components/common/FormModal';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { getCategopryAll, getIngredientesAll } from '../utils/Api';
import IngredienteDelProductoForm from '../components/common/IngredienteDelProductoForm';
import type { IArticle } from '../api/types/IArticle';
import type { IFormFieldConfig, ISelectOption } from '../components/crud/GenericForm.types';

export const ProductsPage: React.FC = () => {
    const {
        data: products,
        loading,
        error,
        fetchData,

        createItem,
        updateItem,
    } = useCrud<IProduct>(productApi);

    const [productsCount, setProductsCount] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    type IngredienteConCantidad = { ingrediente: IArticle; cantidad: number };
    const [selectedIngredientes, setSelectedIngredientes] = useState<IngredienteConCantidad[]>([]);
    const [ingredientesAll, setIngredientesAll] = useState<IArticle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [categories, setCategories] = useState<Category[]>([]);

    // NUEVO ESTADO PARA MODAL DE VISTA (SOLO LECTURA)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [productToView, setProductToView] = useState<IProduct | null>(null);

    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';



    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    useEffect(() => {
        setProductsCount(products.length);
        const fetchIngredientes = async () => {
            const ingredientes = await getIngredientesAll();
            // Filtrar solo ingredientes que NO son para venta (forSale = false)
            setIngredientesAll(ingredientes.filter((ingrediente: IArticle) => ingrediente.forSale === false));
        };
        fetchIngredientes();
    }, [products]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesFromApi: Category[] = await getCategopryAll();
                setCategories(categoriesFromApi);
            } catch (error) {
                console.error("Error cargando categorías", error);
            }
        };
        fetchCategories();
    }, []);

    const productColumns: ITableColumn<IProduct>[] = [
        { id: 'idmanufacturedArticle', label: '#', numeric: true },
        { id: 'name', label: 'Nombre' },
        {
            id: 'price',
            label: 'Precio',
            numeric: true,
            render: (item) => `$${item.price?.toFixed(2) ?? '0.00'}`
        },
        {
            id: 'manufacturedArticleDetail',
            label: 'Ingredientes',
            render: (item) =>
                item.manufacturedArticleDetail
                    .map(ing => ing.article?.denomination ?? '')
                    .filter(denomination => denomination)
                    .join(', ')
        },
        {
            id: 'category',
            label: 'Categoría',
            render: (item) => item.category?.name ?? 'Sin categoría'
        },
        {
            id: 'isAvailable',
            label: 'Estado',
            render: (item) => (
                <span style={{
                    fontWeight: 'bold',
                    color: item.isAvailable ? '#2ecc40' : '#e74c3c'
                }}>
                    {item.isAvailable ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        { id: 'estimatedTimeMinutes', label: 'Tiempo (minutos)', render: (item) => item.estimatedTimeMinutes },
        ...(isAdmin
            ? [{
                id: "acciones" as const,
                label: 'Acciones',
                render: (item: IProduct) => (
                    <div className="table-actions">
                        <Button variant="actions" onClick={() => handleEdit(item)}>
                            <img src="../../../public/icons/pencil.png" alt="Editar" className="pencil icon"
                                style={{ width:'18px', height:'18px',filter: 'invert(25%) sepia(83%) saturate(7466%) hue-rotate(196deg) brightness(95%) contrast(104%)' }} />
                        </Button>
                        <Button variant="actions" onClick={() => handleView(item)}>
                            <img src="../../../public/icons/eye-on.svg" alt="Ver" className="pencil icon"
                                style={{width:'18px', height:'18px',  filter: 'invert(52%) sepia(94%) saturate(636%) hue-rotate(1deg) brightness(103%) contrast(102%)' }} />
                        </Button>
                    </div>
                ),
            }]
            : [])];

    // Campos del formulario
    const productFormFields: IFormFieldConfig[] = useMemo(() => [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            validation: { required: true, minLength: 3 }
        },
        {
            name: 'description',
            label: 'Descripción',
            type: 'text',
            validation: { required: true, minLength: 5 },
            placeholder: 'Ej: Jugosa hamburguesa con lechuga, tomate y queso.',
        },
        // {
        //     name: 'price',
        //     label: 'Precio Venta',
        //     type: 'number',
        //     validation: { required: true, min: 0 }
        // },
        {
            name: 'estimatedTimeMinutes',
            label: 'Tiempo (minutos)',
            type: 'number',
            validation: { required: true, min: 1 },
            placeholder: 'Ej: 15'
        },
        {
            name: 'isAvailable',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '', label: 'Seleccionar una categoría...' },
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
            ],
            validation: { required: true },
        },
        {
            name: 'inventoryImageDTO',
            label: 'Imagen del Inventario',
            type: 'file',
            accept: 'image/*',
        },
        {
            name: 'category',
            label: 'Categoría',
            type: 'select',
            options: [
                { value: '', label: 'Seleccionar una categoría...' },
                ...categories.map(cat => ({
                    value: cat.idcategory,
                    label: cat.name
                }))
            ],
            validation: { required: true },
        }
    ], [categories]);


    // Filtro de productos
    const filteredProducts = products.filter(product =>
        (product.name ?? '').toLowerCase().includes((searchTerm ?? '').toLowerCase())
    );

    // Handlers
    const handleCreate = () => {
        setProductToEdit(null);
        setSelectedIngredientes([]);
        setFormValues({});
        setIsModalOpen(true);
    };

    const handleEdit = (product: IProduct) => {

        setProductToEdit(product);
        setSelectedIngredientes(
            product.manufacturedArticleDetail
                .filter(ing => ing.article !== undefined)
                .map(ing => ({
                    ingrediente: ing.article as IArticle,
                    cantidad: ing.quantity
                }))
        );

        setFormValues({
            name: product.name,
            description: product.description,
            price: product.price,
            isAvailable: product.isAvailable ? 'Activo' : 'Inactivo',
            inventoryImageDTO: null,
            estimatedTimeMinutes: product.estimatedTimeMinutes,
            category: product.category?.idcategory ?? ''
        });


        if (product.manufacInventoryImage
            ?.imageData) {
            setImagePreview(`data:image/jpeg;base64,${product.manufacInventoryImage
                .imageData}`);
        } else {
            setImagePreview(null);
        }

        setIsModalOpen(true);
    };

    // NUEVO HANDLER PARA EL MODAL DE VISTA
    const handleView = (product: IProduct) => {
        setProductToView(product);
        setIsViewModalOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type } = e.target;
        let value: any;

        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            value = files && files.length > 0 ? files[0] : null;

            // Mostrar previsualización
            if (value) {
                const reader = new FileReader();
                reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                reader.readAsDataURL(value);
            } else {
                setImagePreview(null);
            }
        } else {
            value = e.target.value;
        }

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // Función auxiliar para convertir File a Base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = (error) => reject(error);
        });
    };




    // ...existing code...
    const handleFormSubmit = async () => {
        // Validar campos requeridos
        const requiredFields = ['name', 'description', 'price', 'estimatedTimeMinutes', 'isAvailable', 'category'];

        for (const field of requiredFields) {
            if (!formValues[field] || (typeof formValues[field] === 'string' && formValues[field].trim() === '')) {
                alert(`El campo "${field}" es obligatorio.`);
                return;
            }
        }

        // Validar que haya al menos un ingrediente seleccionado
        if (selectedIngredientes.length === 0) {
            alert('Debe seleccionar al menos un ingrediente.');
            return;
        }

        let inventoryImageDTO: InventoryImage = { imageData: '' };

        try {
            if (formValues.inventoryImageDTO) {
                const base64Data = await convertFileToBase64(formValues.inventoryImageDTO);
                const base64String = base64Data.split(',')[1];
                inventoryImageDTO = { imageData: base64String };
            } else if (productToEdit && productToEdit.manufacInventoryImage?.imageData) {
                // Si no hay nueva imagen pero existe una previa, usa la anterior
                inventoryImageDTO = { imageData: productToEdit.manufacInventoryImage.imageData };
            } else {
                inventoryImageDTO = { imageData: '' };
            }
            const manufacturedArticleDetail: ManufacturedArticleDetail[] = selectedIngredientes.map((ing) => ({
                articleId: ing.ingrediente.idarticle,
                quantity: ing.cantidad,
            }));

            const isAvailable = formValues.isAvailable === 'Activo';

            // Construir el objeto según si es edición o creación
            let newProduct: any = {
                name: formValues.name,
                description: formValues.description,
                price: parseFloat(formValues.price),
                estimatedTimeMinutes: Number(formValues.estimatedTimeMinutes),
                isAvailable,
                manufacturedArticleDetail,
                inventoryImageDTO,
                category: Number(formValues.category),
            };

            if (productToEdit) {
                // Solo en edición, agrega idmanufacturedArticle
                newProduct.idmanufacturedArticle = productToEdit.idmanufacturedArticle;


                await updateItem(newProduct);
            } else {
                // Solo en creación, agrega id autogenerado
                newProduct.id = productsCount;
                await createItem(newProduct);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Error al procesar el formulario.');
            console.error(error);
        }
    };


    // En el componente ProductsPage, agregar handler para el precio
    const handlePriceChange = (price: number) => {
        setFormValues(prev => ({
            ...prev,
            price: price
        }));
    };


    // Renderizado
    if (loading && products.length === 0) return <p>Cargando productos...</p>;
    if (error) return <p className="error-message">Error al cargar productos: {error}</p>;

    return (
        <div className="crud-page-container">
            {/* <div className="page-header">
                <h2>PRODUCTOS</h2>
            </div> */}

            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>
                        Nuevo Producto
                    </Button>
                )}
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilter"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                />
            </div>

            <GenericTable
                data={filteredProducts}
                columns={productColumns}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={productToEdit ? 'Editar Producto' : 'Crear Producto'}
                onSubmit={handleFormSubmit}
            >
                {productFormFields.map(field => {
                    const isFileInput = field.type === 'file';
                    return (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type as any}
                            placeholder={field.placeholder}
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

                <IngredienteDelProductoForm
                    ingredientesAll={ingredientesAll}
                    selectedIngredientes={selectedIngredientes}
                    onIngredientesChange={setSelectedIngredientes}
                    onPriceChange={handlePriceChange}
                />
                <Button variant="primary" type="submit">
                    {productToEdit ? 'Actualizar' : 'Crear'}
                </Button>
            </FormModal>

            {/* NUEVO MODAL SOLO LECTURA */}
            <FormModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalle del Producto"
                onSubmit={undefined}
            >
                {productToView && (
                    <>
                        <InputField
                            label="Nombre"
                            name="name"
                            type="text"
                            value={productToView.name ?? ''}
                            disabled
                        />
                        <InputField
                            label="Descripción"
                            name="description"
                            type="text"
                            value={productToView.description ?? ''}
                            disabled
                        />
                        <InputField
                            label="Precio"
                            name="price"
                            type="number"
                            value={productToView.price?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Tiempo (minutos)"
                            name="estimatedTimeMinutes"
                            type="number"
                            value={productToView.estimatedTimeMinutes?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Estado"
                            name="isAvailable"
                            type="text"
                            value={productToView.isAvailable ? 'Activo' : 'Inactivo'}
                            disabled
                        />
                        <InputField
                            label="Categoría"
                            name="category"
                            type="text"
                            value={productToView.category?.name ?? 'Sin categoría'}
                            disabled
                        />
                        {productToView.manufacInventoryImage?.imageData && (
                            <div style={{ marginBottom: 16 }}>
                                <label>Imagen del Inventario:</label>
                                <img
                                    src={`data:image/jpeg;base64,${productToView.manufacInventoryImage.imageData}`}
                                    alt="Imagen del producto"
                                    style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                                />
                            </div>
                        )}
                                                <div style={{ marginBottom: 16 }}>
                            <label>Ingredientes:</label>
                            <ul>
                                {productToView.manufacturedArticleDetail.map((ing, index) => (
                                    <li key={index}>
                                        {ing.article?.denomination ?? ''} - Cantidad: {ing.quantity}
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
