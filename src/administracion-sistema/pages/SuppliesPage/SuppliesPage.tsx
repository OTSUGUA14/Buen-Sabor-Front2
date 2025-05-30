// src/administracion-sistema/pages/SuppliesPage/SuppliesPage.tsx

import React, { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { supplyApi } from '../../api/supply'; // Importa la API de insumos
import type { ISupply } from '../../api/types/ISupply'; // Importa la interfaz de insumos
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField'; // Necesario para el buscador
import { SelectField } from '../../components/common/SelectField/SelectField'; // Necesario para el filtro de estado
// ELIMINA: import './SuppliesPage.css';
import '../crud-pages.css'; // <--- NUEVA IMPORTACIÓN

export const SuppliesPage: React.FC = () => {
    // Usa el hook useCrud con la API de insumos y el tipo ISupply
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

    // --- Estados para el buscador y filtro ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    // --- Lógica de filtrado de insumos (similar a ProductsPage) ---
    const filteredSupplies = useMemo(() => {
        return supplies.filter((supply) => {
            const matchesSearch = supply.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supply.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supply.subCategoria.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || supply.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [supplies, searchTerm, statusFilter]);

    // Definición de las columnas para la tabla de insumos
    const supplyColumns: ITableColumn<ISupply>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'nombre', label: 'Nombre' },
        { id: 'unidadMedida', label: 'Unidad de Medida' },
        { id: 'categoria', label: 'Categoría' }, // Añadido
        { id: 'subCategoria', label: 'Subcategoría' }, // Añadido
        { id: 'stockActual', label: 'Stock Actual', numeric: true },
        { id: 'stockMinimo', label: 'Stock Mínimo', numeric: true },
        { id: 'costo', label: 'Costo', numeric: true, render: (item) => `$${item.costo.toFixed(2)}` },
        { id: 'estado', label: 'Estado' }, // Añadido
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

    // Configuración de los campos para el formulario de insumos
    const supplyFormFields: IFormFieldConfig[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'unidadMedida', label: 'Unidad de Medida', type: 'text', validation: { required: true } },
        { name: 'categoria', label: 'Categoría', type: 'text', validation: { required: true } }, // Añadido
        { name: 'subCategoria', label: 'Subcategoría', type: 'text', validation: { required: true } }, // Añadido
        { name: 'stockActual', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'stockMinimo', label: 'Stock Mínimo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'costo', label: 'Costo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'estado', label: 'Estado', type: 'select', options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }], validation: { required: true } }, // Añadido
    ];

    const handleCreate = () => {
        setSupplyToEdit(null); // Para asegurar que el formulario esté vacío
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
            fetchData(); // Vuelve a cargar los datos después de eliminar
        }
    };

    const handleFormSubmit = async (formData: Partial<ISupply>) => {
        const submitData: ISupply = {
            id: supplyToEdit?.id || Math.floor(Math.random() * 1000000000), // Genera ID para el mock si es nuevo
            nombre: formData.nombre!,
            unidadMedida: formData.unidadMedida!,
            categoria: formData.categoria!, // Añadido
            subCategoria: formData.subCategoria!, // Añadido
            stockActual: Number(formData.stockActual),
            stockMinimo: Number(formData.stockMinimo),
            costo: Number(formData.costo),
            estado: formData.estado as 'Activo' | 'Inactivo', // Asegura el tipo correcto
        };

        if (supplyToEdit) {
            // Edición
            await updateItem(submitData);
        } else {
            // Creación
            await createItem(submitData);
        }
        setIsModalOpen(false);
        setSupplyToEdit(null); // Limpiar el estado de edición
        fetchData(); // Recargar los datos después de crear/actualizar
    };

    if (loading && supplies.length === 0) return <p>Cargando insumos...</p>;
    if (error) return <p className="error-message">Error al cargar insumos: {error}</p>;

    return (
        <div className="crud-page-container"> {/* <--- CLASE CAMBIADA */}
            <div className="page-header">
                <h2>Gestión de Insumos</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Nuevo Insumo
                </Button>
            </div>

            {/* --- Controles de Filtro y Búsqueda (añadidos) --- */}
            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre, categoría o subcategoría..."
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
                data={filteredSupplies} // Pasa los insumos filtrados
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
                    initialData={supplyToEdit || undefined} // Pasa los datos del insumo a editar
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