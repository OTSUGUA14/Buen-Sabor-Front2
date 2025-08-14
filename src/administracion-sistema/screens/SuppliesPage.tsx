import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { supplyApi } from '../api/supply';
import type { IArticle } from '../api/types/IArticle';
import { FormModal } from '../components/common/FormModal';

import type { ISelectOption } from '../components/crud/GenericForm.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { getCategopryAll, getMeasuringUnitsAll } from '../utils/Api';

import './styles/crud-pages.css';
import type { Category } from '../api/types/IProduct';

export const SuppliesPage: React.FC = () => {
    const {
        data: ingredientesAll,
        loading,
        error,
        fetchData,
        createItem,
        updateItem,
    } = useCrud(supplyApi);

    useEffect(() => {

    }, [ingredientesAll]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplyToEdit, setSupplyToEdit] = useState<IArticle | null>(null);

    // ESTADO PARA MODAL DE VISTA (SOLO LECTURA)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [supplyToView, setSupplyToView] = useState<IArticle | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Activo' | 'Inactivo'>('TODOS');
    const [categoryFilter, setCategoryFilter] = useState<'TODOS' | string>('TODOS');
    const [categories, setCategories] = useState<Category[]>([]);
    const [measuringUnits, setMeasuringUnits] = useState<{ unit: string; idmeasuringUnit: number }[]>([]);
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';
    useEffect(() => {
        getCategopryAll().then(data => {
            setCategories(data.filter(cat => cat.forSale === false));
        });
        getMeasuringUnitsAll().then(data => {
            setMeasuringUnits(data);
        });
    }, []);

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];



    // Opciones de categoría para el select
    const categoryOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        ...categories.map(cat => ({
            value: cat.idcategory,
            label: cat.name
        })),
    ], [categories]);
    // Opciones para el select de unidades de medida
    const measuringUnitOptions: ISelectOption[] = useMemo(() =>
        measuringUnits.map(mu => ({
            value: mu.idmeasuringUnit,
            label: mu.unit
        })),
        [measuringUnits]);

    const filteredSupplies = useMemo(() => {
        return ingredientesAll.filter(item => {
            const nombre = item.denomination?.toLowerCase() ?? '';
            const unidad = item.measuringUnit?.unit?.toLowerCase() ?? '';
            const categoria = item.category?.name?.toLowerCase() ?? '';
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                nombre.includes(search) ||
                unidad.includes(search) ||
                categoria.includes(search);

            const matchesCategory =
                categoryFilter === 'TODOS' ||
                categoria === categoryFilter.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [ingredientesAll, searchTerm, statusFilter, categoryFilter]);

    const supplyColumns: ITableColumn<IArticle>[] = [
        { id: 'idarticle', label: '#' },
        { id: 'denomination', label: 'Nombre' },
        {
            id: 'measuringUnit',
            label: 'Unidad',
            render: i => i.measuringUnit?.unit ?? ''
        },
        { id: 'currentStock', label: 'Stock Actual', numeric: true },
        { id: 'maxStock', label: 'Stock Máximo', numeric: true },
        {
            id: 'buyingPrice',
            label: 'Precio Compra',
            numeric: true,
            render: i => i.buyingPrice != null ? `$${i.buyingPrice.toFixed(2)}` : ''
        },
        {
            id: 'category',
            label: 'Categoría',
            render: i => i.category?.name ?? ''
        },
        {
            id: 'forSale',
            label: 'Para venta',
            render: i => i.forSale ? 'Sí' : 'No'
        },
        ...(isAdmin
            ? [{
                id: 'acciones' as const, // <-- así TypeScript lo acepta
                label: 'Acciones',
                render: (item: IArticle) => (
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

    const supplyFormFields = useMemo(() => [
        { name: 'denomination', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'measuringUnit',
            label: 'Unidad de Medida',
            type: 'select',
            options: measuringUnitOptions,
            validation: { required: true },
        },
        { name: 'currentStock', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'maxStock', label: 'Stock Máximo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'buyingPrice', label: 'Precio Compra', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'category',
            label: 'Categoría',
            type: 'select',
            options: categoryOptions.filter(opt => opt.value !== 'TODOS'),
            validation: { required: true },
        },
        {
            name: 'forSale',
            label: '¿Para venta?',
            type: 'select',
            options: [
                { value: "true", label: 'Sí' },
                { value: "false", label: 'No' }
            ],
            validation: { required: true },
        },
        {
            name: 'inventoryImage',
            label: 'Imagen',
            type: 'file',
            accept: 'image/*'
        }
    ], [measuringUnitOptions, categoryOptions]);

    // 7. Handlers CRUD
    const handleCreate = () => {


        setSupplyToEdit(null);
        setIsModalOpen(true);
    };

    // HANDLER PARA VER INSUMO
    const handleView = (item: IArticle) => {
        setSupplyToView(item);
        setIsViewModalOpen(true);
    };

    const handleEdit = (item: IArticle) => {
        setSupplyToEdit(item);

        // Llena los campos del formulario
        setFormValues({
            idarticle: item.idarticle,
            denomination: item.denomination,
            measuringUnit: item.measuringUnit?.idmeasuringUnit,
            currentStock: item.currentStock,
            maxStock: item.maxStock,
            buyingPrice: item.buyingPrice,
            category: item.category?.idcategory,
            forSale: String(item.forSale),
            inventoryImage: item.inventoryImage ?? undefined,
        });

        // Previsualiza la imagen si existe
        if (item.inventoryImage && item.inventoryImage.imageData) {
            // Si ya es base64, úsalo directamente
            let imageData = item.inventoryImage.imageData;
            if (!imageData.startsWith('data:image')) {
                // Si solo es base64, agrega el prefijo para previsualización
                imageData = `data:image/jpeg;base64,${imageData}`;
            }
            setImagePreview(imageData);
        } else {
            setImagePreview(null);
        }

        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Validaciones básicas
        const requiredFields = ['denomination', 'measuringUnit', 'currentStock', 'maxStock', 'buyingPrice', 'category', 'forSale'];
        
        for (const field of requiredFields) {
            if (!formValues[field] || formValues[field].toString().trim() === '') {
                alert(`El campo "${field}" es obligatorio`);
                return;
            }
        }

        try {
            const id = supplyToEdit?.id || Math.floor(Math.random() * 1e9);
            const unit = Number(formValues.measuringUnit);
            const categoriaId = Number(formValues.category);
            const forSale = String(formValues.forSale) === "true";
            
            let inventoryImage = null;
            if (forSale && formValues.inventoryImage) {
                const img = formValues.inventoryImage;
                if (img instanceof File) {
                    // Si es un archivo nuevo, conviértelo a base64
                    const imageData = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(img);
                    });
                    inventoryImage = { IDInventoryImage: 0, imageData };
                } else if (typeof img === 'object' && img !== null && 'imageData' in img) {
                    inventoryImage = img;
                }
            }

            if (supplyToEdit) {
                // Modo edición
                const submitData: IArticle = {
                    id,
                    idarticle: formValues.idarticle,
                    denomination: formValues.denomination,
                    measuringUnit: {
                        unit: "",
                        idmeasuringUnit: unit,
                    },
                    currentStock: Number(formValues.currentStock),
                    maxStock: Number(formValues.maxStock),
                    buyingPrice: Number(formValues.buyingPrice),
                    category: {
                        name: "",
                        idcategory: categoriaId,
                    },
                    forSale,
                    inventoryImage,
                };
                await updateItem(submitData);
            } else {
                // Modo creación
                const submitData: Omit<IArticle, "id"> = {
                    denomination: formValues.denomination,
                    currentStock: Number(formValues.currentStock),
                    maxStock: Number(formValues.maxStock),
                    buyingPrice: Number(formValues.buyingPrice),
                    measuringUnit: {
                        unit: "",
                        idmeasuringUnit: unit,
                    },
                    category: {
                        name: "",
                        idcategory: categoriaId,
                    },
                    forSale,
                    inventoryImage,
                };
                await createItem(submitData);
            }

            // Cerrar modal y limpiar estados
            setIsModalOpen(false);
            setSupplyToEdit(null);
            setFormValues({});
            setImagePreview(null);
            fetchData();
        } catch (error) {
            console.error('Error al guardar insumo:', error);
            alert('Error al guardar insumo: ' + (error as Error).message);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type, files, value } = e.target as HTMLInputElement;
        if (type === 'file' && files && files.length > 0) {
            setFormValues(prev => ({ ...prev, [name]: files[0] }));
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(files[0]);
        } else {
            setFormValues(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading && ingredientesAll.length === 0) return <p>Cargando insumos...</p>;
    if (error) return <p className="error-message">Error al cargar insumos: {error}</p>;

    return (
        <div className="crud-page-container">
            {/* <div className="page-header">
                <h2>INSUMOS</h2>
            </div> */}

            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>Nuevo Insumo</Button>
                )}
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <SelectField
                    name="statusFilter"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as 'TODOS' | 'Activo' | 'Inactivo')}
                    className="status-select"
                />
            </div>

            <GenericTable
                data={filteredSupplies}
                columns={supplyColumns}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={supplyToEdit ? 'Editar Insumo' : 'Crear Insumo'}
                onSubmit={undefined}
            >
                <form onSubmit={handleFormSubmit}>
                    <SelectField
                        label="Unidad de Medida"
                        name="measuringUnit"
                        options={[{ value: '', label: 'Seleccionar unidad' }, ...measuringUnitOptions]}
                        value={formValues.measuringUnit ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Nombre"
                        name="denomination"
                        type="text"
                        value={formValues.denomination ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Stock Actual"
                        name="currentStock"
                        type="number"
                        value={formValues.currentStock ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Stock Máximo"
                        name="maxStock"
                        type="number"
                        value={formValues.maxStock ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Precio Compra"
                        name="buyingPrice"
                        type="number"
                        step="0.01"
                        value={formValues.buyingPrice ?? ''}
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="Categoría"
                        name="category"
                        options={[{ value: '', label: 'Seleccionar categoría' }, ...categoryOptions.filter(opt => opt.value !== 'TODOS')]
                        }
                        value={formValues.category ?? ''}
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="¿Para venta?"
                        name="forSale"
                        options={[
                            { value: '', label: 'Seleccionar opción' },
                            { value: "true", label: 'Sí' },
                            { value: "false", label: 'No' }
                        ]}
                        value={formValues.forSale ?? ''}
                        onChange={handleInputChange}
                    />
                    
                    {/* Campo de imagen solo si es para venta */}
                    {String(formValues.forSale) === "true" && (
                        <InputField
                            label="Imagen"
                            name="inventoryImage"
                            type="file"
                            onChange={handleInputChange}
                        />
                    )}

                    {/* Previsualización de la imagen */}
                    {String(formValues.forSale) === "true" && imagePreview && (
                        <div style={{ marginBottom: 16 }}>
                            <label>Vista previa de la imagen:</label>
                            <img
                                src={imagePreview}
                                alt="Vista previa"
                                style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                            />
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            handleFormSubmit();
                        }}
                    >
                        {supplyToEdit ? 'Actualizar Insumo' : 'Crear Insumo'}
                    </Button>
                </form>
            </FormModal>


            {/* NUEVO MODAL SOLO LECTURA */}
            <FormModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalle del Insumo"
                onSubmit={undefined}
            >
                {supplyToView && (
                    <>
                        <InputField
                            label="Nombre"
                            name="denomination"
                            type="text"
                            value={supplyToView.denomination ?? ''}
                            disabled
                        />
                        <InputField
                            label="Unidad de Medida"
                            name="measuringUnit"
                            type="text"
                            value={supplyToView.measuringUnit?.unit ?? ''}
                            disabled
                        />
                        <InputField
                            label="Stock Actual"
                            name="currentStock"
                            type="number"
                            value={supplyToView.currentStock?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Stock Máximo"
                            name="maxStock"
                            type="number"
                            value={supplyToView.maxStock?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Precio Compra"
                            name="buyingPrice"
                            type="number"
                            value={supplyToView.buyingPrice?.toString() ?? ''}
                            disabled
                        />
                        <InputField
                            label="Categoría"
                            name="category"
                            type="text"
                            value={supplyToView.category?.name ?? ''}
                            disabled
                        />
                        <InputField
                            label="¿Para venta?"
                            name="forSale"
                            type="text"
                            value={supplyToView.forSale ? 'Sí' : 'No'}
                            disabled
                        />
                        {supplyToView.forSale && supplyToView.inventoryImage?.imageData && (
                            <div style={{ marginBottom: 16 }}>
                                <label>Imagen:</label>
                                <img
                                    src={
                                        supplyToView.inventoryImage.imageData.startsWith('data:image')
                                            ? supplyToView.inventoryImage.imageData
                                            : `data:image/jpeg;base64,${supplyToView.inventoryImage.imageData}`
                                    }
                                    alt="Imagen del insumo"
                                    style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                                />
                            </div>
                        )}
                    </>
                )}
            </FormModal>

        </div>
    );
};