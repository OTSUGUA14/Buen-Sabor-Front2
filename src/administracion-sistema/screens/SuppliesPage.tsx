import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { supplyApi } from '../api/supply';
import type { IArticle } from '../api/types/IArticle'; 
import { FormModal } from '../components/common/FormModal';
import { GenericForm } from '../components/crud/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../components/crud/GenericForm.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';

import './styles/crud-pages.css';

export const SuppliesPage: React.FC = () => {
    const {
        data: ingredientesAll,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<IArticle>(supplyApi); 

    useEffect(() => {
        
    }, [ingredientesAll]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [supplyToDeleteId, setSupplyToDeleteId] = useState<number | null>(null);
    const [supplyToEdit, setSupplyToEdit] = useState<IArticle | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Activo' | 'Inactivo'>('TODOS');
    const [categoryFilter, setCategoryFilter] = useState<'TODOS' | string>('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    const supplyCategoryValues: string[] = [
        'Proteinas',
        'Vegetales',
        'Lacteos',
        'Panificados',
    ];

    const categoryOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        ...supplyCategoryValues.map(cat => ({ value: cat, label: cat })),
    ], [supplyCategoryValues]); 

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

    const supplyFormFields: IFormFieldConfig[] = [
        { name: 'denomination', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'unidadMedicion', 
            label: 'Unidad de Medida',
            type: 'select',
            options: [{ value: 'Kg', label: 'Kg' }, { value: 'L', label: 'L' }],
            validation: { required: true },
        },
        { name: 'currentStock', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'maxStock', label: 'Stock Máximo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'buyingPrice', label: 'Precio Compra', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'categoria', 
            label: 'Categoría',
            type: 'select',
            options: categoryOptions.filter(opt => opt.value !== 'TODOS'),
            validation: { required: true },
        },
    ];

    // 7. Handlers CRUD
    const handleCreate = () => {
        setSupplyToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: IArticle) => {
        setSupplyToEdit(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setSupplyToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (supplyToDeleteId !== null) {
            await deleteItem(supplyToDeleteId);
            setIsConfirmDialogOpen(false);
            setSupplyToDeleteId(null);
            fetchData();
        }
    };
    const handleFormSubmit = async (formData: Partial<IArticle>) => {
        const id = supplyToEdit?.id || Math.floor(Math.random() * 1e9);

        const unit = formData.measuringUnit as unknown as string;
        const categoriaNombre = formData.category as unknown as string;

        const submitData: IArticle = {
            id,
            idarticle: id,
            denomination: formData.denomination!,
            measuringUnit: {
                unit,
                idmeasuringUnit: 0,
            },
            currentStock: Number(formData.currentStock),
            maxStock: Number(formData.maxStock),
            buyingPrice: Number(formData.buyingPrice),
            category: {
                name: categoriaNombre,
                idcategory: 0,
            },
        };

        if (supplyToEdit) {
            await updateItem(submitData);
        } else {
            await createItem(submitData);
        }
        setIsModalOpen(false);
        setSupplyToEdit(null);
        fetchData();
    };

    if (loading && ingredientesAll.length === 0) return <p>Cargando insumos...</p>;
    if (error) return <p className="error-message">Error al cargar insumos: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Insumos</h2>
                <Button variant="primary" onClick={handleCreate}>Nuevo Insumo</Button>
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre o categoría..."
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
            >
                <GenericForm<IArticle> 
                    initialData={supplyToEdit ?? undefined}
                    fieldsConfig={supplyFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={supplyToEdit ? 'Actualizar Insumo' : 'Crear Insumo'}
                />
            </FormModal>

        </div>
    );
};