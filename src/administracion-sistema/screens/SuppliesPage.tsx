import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { supplyApi} from '../api/supply';
import type { IArticle } from '../api/types/IArticle';
import { FormModal } from '../components/common/FormModal';
import { GenericForm } from '../components/crud/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../components/crud/GenericForm.types';
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

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Activo' | 'Inactivo'>('TODOS');
    const [categoryFilter, setCategoryFilter] = useState<'TODOS' | string>('TODOS');
    const [categories, setCategories] = useState<Category[]>([]);
    const [measuringUnits, setMeasuringUnits] = useState<{ unit: string; idmeasuringUnit: number }[]>([]);
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        {
            id: 'acciones',
            label: 'Acciones',
            render: item => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>
                        Editar
                    </Button>
                </div>
            ),
        },
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

    const handleFormSubmit = async (formData: Partial<IArticle>) => {
        const id = supplyToEdit?.id || Math.floor(Math.random() * 1e9);


        const unit = formData.measuringUnit as unknown as number; // Debe ser el id de la unidad
        const categoriaId = formData.category as unknown as number; // Debe ser el id de la categoría
        const forSale = String(formData.forSale) === "true"; // Puede venir como string
        let inventoryImage = null;
        if (formData.inventoryImage) {
            const img = formData.inventoryImage;
            if (img instanceof File) {
                // Si es un archivo nuevo, conviértelo a base64 y arma el objeto esperado
                const imageData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(img);
                });
                inventoryImage = { IDInventoryImage: 0, imageData };
            } else if (
                typeof img === 'object' &&
                img !== null &&
                'imageData' in img
            ) {
                // Si viene del backend, ya tiene imageData
                inventoryImage = img;
            }
        }

        if (supplyToEdit) {
            // Si se edita, envía el objeto completo como antes
            const submitData: IArticle = {
                id,
                idarticle: formData.idarticle,
                denomination: formData.denomination!,
                measuringUnit: {
                    unit: typeof unit === "string" ? unit : "",
                    idmeasuringUnit: typeof unit === "number" ? unit : 0,
                },
                currentStock: Number(formData.currentStock),
                maxStock: Number(formData.maxStock),
                buyingPrice: Number(formData.buyingPrice),
                category: {
                    name: "",
                    idcategory: typeof categoriaId === "number" ? categoriaId : 0,
                },
                forSale,
                inventoryImage,
            };
            await updateItem(submitData);
        } else {
            // Si es creación, solo envía los valores simples
            const submitData: Omit<IArticle, "id"> = {
                denomination: formData.denomination!,
                currentStock: Number(formData.currentStock),
                maxStock: Number(formData.maxStock),
                buyingPrice: Number(formData.buyingPrice),
                measuringUnit: {
                    unit: "", // o el valor real si lo tienes
                    idmeasuringUnit: unit,
                },
                category: {
                    name: "", // o el valor real si lo tienes
                    idcategory: categoriaId,
                },
                forSale,
                inventoryImage,
            };
            await createItem(submitData);
        }
        setIsModalOpen(false);
        setSupplyToEdit(null);
        fetchData();
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
            <div className="page-header">
                <h2>INSUMOS</h2>
            </div>

            <div className="filter-controls">
                <Button variant="primary" onClick={handleCreate}>Nuevo Insumo</Button>
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
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleFormSubmit(formValues);
                }}
            >
                {supplyFormFields.map(field => {
                    // Oculta el campo de imagen si no es para venta
                    if (
                        field.name === 'inventoryImage' &&
                        String(formValues.forSale) !== "true"
                    ) {
                        return null;
                    }
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

                {/* Previsualización de la imagen solo si es para venta */}
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

                <Button variant="primary" type="submit">
                    {supplyToEdit ? 'Actualizar Insumo' : 'Crear Insumo'}
                </Button>
            </FormModal>

        </div>
    );
};