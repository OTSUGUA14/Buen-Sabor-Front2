// src/administracion-sistema/pages/SuppliesPage/SuppliesPage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { supplyApi } from '../../api/supply';
import type { Ingrediente } from '../../api/types/IIngrediente';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import '../crud-pages.css';


export const SuppliesPage: React.FC = () => {
    // 🚀 CRUD Hook
    const {
        data: supplies,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<Ingrediente>(supplyApi);

    // 🔹 Estados UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [supplyToDeleteId, setSupplyToDeleteId] = useState<number | null>(null);
    const [supplyToEdit, setSupplyToEdit] = useState<Ingrediente | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'TODOS' | 'Activo' | 'Inactivo'>('TODOS');
    const [categoryFilter, setCategoryFilter] = useState<'TODOS' | string>('TODOS');

    // 🔹 Opciones de filtro
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
    ], []);

    // 🔹 Filtrado de datos
    // 🔹 Filtrado de datos (versión segura)
    const filteredSupplies = useMemo(() => {
        return supplies.filter(item => {
            const nombre = item.nombre?.toLowerCase() ?? '';
            const unidad = item.unidadMedicion?.unidad?.toLowerCase() ?? '';
            const categoria = item.categoria?.nombreCategoria?.toLowerCase() ?? '';
            const estado = (item.estado ?? '').toLowerCase();
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                nombre.includes(search) ||
                unidad.includes(search) ||
                categoria.includes(search);

            const matchesStatus =
                statusFilter === 'TODOS' ||
                estado === statusFilter.toLowerCase();

            const matchesCategory =
                categoryFilter === 'TODOS' ||
                categoria === categoryFilter.toLowerCase();

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [supplies, searchTerm, statusFilter, categoryFilter]);


    // 🔹 Columnas para la tabla
    const supplyColumns: ITableColumn<Ingrediente>[] = [
        { id: 'idArticulo', label: '#' },
        { id: 'nombre', label: 'Nombre' },
        {
            id: 'unidadMedicion',
            label: 'Unidad',
            render: i => i.unidadMedicion?.unidad ?? ''
        },

        { id: 'stockActual', label: 'Stock Actual', numeric: true },
        { id: 'stockMaximo', label: 'Stock Máximo', numeric: true },
        {
            id: 'precioCompra',
            label: 'Precio Compra',
            numeric: true,
            render: i => i.precioCompra != null ? `$${i.precioCompra.toFixed(2)}` : ''
        },
        {
            id: 'categoria',
            label: 'Categoría',
            render: i => i.categoria?.nombreCategoria ?? ''
        },
        { id: 'estado', label: 'Estado' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: item => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>
                        Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(item.idArticulo)}>
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    // 🔹 Configuración de campos para el formulario
    const supplyFormFields: IFormFieldConfig[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'unidadMedicion',
            label: 'Unidad de Medida',
            type: 'select',
            options: [{ value: 'Kg', label: 'Kg' }, { value: 'L', label: 'L' }], // Ajusta según tus unidades
            validation: { required: true },
        },
        { name: 'stockActual', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'stockMaximo', label: 'Stock Máximo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'precioCompra', label: 'Precio Compra', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'categoria',
            label: 'Categoría',
            type: 'select',
            options: categoryOptions.filter(opt => opt.value !== 'TODOS'),
            validation: { required: true },
        },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
            ],
            validation: { required: true },
        },
    ];

    // 🔹 Handlers CRUD
    const handleCreate = () => {
        setSupplyToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Ingrediente) => {
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

    const handleFormSubmit = async (formData: Partial<Ingrediente>) => {
        // 1️⃣ Asegúrate de generar/ampliar el campo `id`:
        const id = supplyToEdit?.id || Math.floor(Math.random() * 1e9);

        // 2️⃣ Extrae la unidad y la categoría desde el formData (vienen como string):
        const unidad = formData.unidadMedicion as unknown as string;
        const categoriaNombre = formData.categoria as unknown as string;

        const submitData: Ingrediente = {
            id,                             // <--- aquí
            idArticulo: id,                 // mantenemos alias
            nombre: formData.nombre!,
            unidadMedicion: {
                unidad,
                idUnidadMedicion: 0,          // si tienes un ID real, colócalo aquí
            },
            stockActual: Number(formData.stockActual),
            stockMaximo: Number(formData.stockMaximo),
            precioCompra: Number(formData.precioCompra),
            categoria: {
                nombreCategoria: categoriaNombre,
                idCategoria: 0,               // si tienes un ID real, colócalo aquí
            },
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

    // 🔹 Render
    if (loading && supplies.length === 0) return <p>Cargando insumos...</p>;
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

                <SelectField
                    name="categoryFilter"
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
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
                <GenericForm<Ingrediente>
                    initialData={supplyToEdit ?? undefined}
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
                message="¿Estás seguro que deseas eliminar este insumo?"
            />
        </div>
    );
};
