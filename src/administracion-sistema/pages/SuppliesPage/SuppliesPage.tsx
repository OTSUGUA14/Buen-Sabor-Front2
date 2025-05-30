// src/administracion-sistema/pages/SuppliesPage/SuppliesPage.tsx

import React, { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { supplyApi } from '../../api/supply';
import type { ISupply } from '../../api/types/ISupply';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import '../crud-pages.css';

export const SuppliesPage: React.FC = () => {
    const {
        data: supplies,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<ISupply>(supplyApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [supplyToDeleteId, setSupplyToDeleteId] = useState<number | null>(null);
    const [supplyToEdit, setSupplyToEdit] = useState<ISupply | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [categoryFilter, setCategoryFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    const supplyCategoryValues: Array<ISupply['categoria']> = [
        'Proteinas',
         'Vegetales',
         'Lacteos',
         'Panificados',
    ];

    const categoryOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        ...supplyCategoryValues.map(category => ({ value: category, label: category }))
    ], []);

    const filteredSupplies = useMemo(() => {
        return supplies.filter((supply) => {
            const matchesSearch = supply.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supply.unidadMedida.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supply.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supply.subCategoria.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || supply.estado === statusFilter;
            const matchesCategory = categoryFilter === 'TODOS' || supply.categoria === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [supplies, searchTerm, statusFilter, categoryFilter]);

    const supplyColumns: ITableColumn<ISupply>[] = [
        { id: 'id', label: '#' },
        { id: 'nombre', label: 'Nombre' },
        { id: 'unidadMedida', label: 'Unidad de Medida' },
        { id: 'stockActual', label: 'Stock Actual', numeric: true },
        { id: 'stockMinimo', label: 'Stock Mínimo', numeric: true },
        { id: 'costo', label: 'Costo', numeric: true, render: (item) => `$${item.costo.toFixed(2)}` },
        { id: 'categoria', label: 'Categoría' },
        { id: 'subCategoria', label: 'Subcategoría' },
        { id: 'estado', label: 'Estado' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>
                        Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(item.id)}>
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    const supplyFormFields: IFormFieldConfig[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'unidadMedida', label: 'Unidad de Medida', type: 'text', validation: { required: true, minLength: 1 } },
        { name: 'stockActual', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'stockMinimo', label: 'Stock Mínimo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'costo', label: 'Costo', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'categoria',
            label: 'Categoría',
            type: 'select',
            options: categoryOptions.filter(opt => opt.value !== 'TODOS'),
            validation: { required: true }
        },
        { name: 'subCategoria', label: 'Subcategoría', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }],
            validation: { required: true }
        },
    ];

    const handleCreate = () => {
        setSupplyToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (supply: ISupply) => {
        setSupplyToEdit(supply);
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

    const handleFormSubmit = async (formData: Partial<ISupply>) => {
        const submitData: ISupply = {
            id: supplyToEdit?.id || Math.floor(Math.random() * 1000000000),
            nombre: formData.nombre!,
            unidadMedida: formData.unidadMedida!,
            stockActual: Number(formData.stockActual),
            stockMinimo: Number(formData.stockMinimo),
            costo: Number(formData.costo),
            categoria: formData.categoria! as ISupply['categoria'],
            subCategoria: formData.subCategoria!,
            estado: formData.estado as 'Activo' | 'Inactivo',
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

    if (loading && supplies.length === 0) return <p>Cargando insumos...</p>;
    if (error) return <p className="error-message">Error al cargar insumos: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Insumos</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Nuevo Insumo
                </Button>
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre, unidad o categoría..."
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
                data={filteredSupplies}
                columns={supplyColumns}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={supplyToEdit ? 'Editar Insumo' : 'Crear Insumo'}
            >
                <GenericForm<ISupply>
                    initialData={supplyToEdit || undefined}
                    fieldsConfig={supplyFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={supplyToEdit ? 'Actualizar Insumo' : 'Crear Insumo'}
                />
            </FormModal>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este insumo? Esta acción no se puede deshacer."
            />
        </div>
    );
};