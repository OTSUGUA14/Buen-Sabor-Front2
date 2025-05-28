// src/administracion-sistema/pages/SuppliesPage/SuppliesPage.tsx

import React, { useState } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { supplyApi } from '../../api/supply'; // Importa la API de insumos
import type { ISupply } from '../../api/types/supply'; // Importa la interfaz de insumos
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig } from '../../components/crud/GenericForm/GenericForm.types';
import './SuppliesPage.css'; // Crearás este archivo CSS para estilos específicos

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

    // Definición de las columnas para la tabla de insumos
    const supplyColumns: ITableColumn<ISupply>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'nombre', label: 'Nombre' },
        { id: 'unidadMedida', label: 'Unidad de Medida' },
        { id: 'stockActual', label: 'Stock Actual', numeric: true },
        { id: 'stockMinimo', label: 'Stock Mínimo', numeric: true },
        { id: 'costo', label: 'Costo', numeric: true, render: (item) => `$${item.costo.toFixed(2)}` },
        {
            id: 'esInsumo',
            label: '¿Es Insumo?',
            render: (item) => (item.esInsumo ? 'Sí' : 'No'),
        },
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
        { name: 'stockActual', label: 'Stock Actual', type: 'number', validation: { required: true, min: 0 } },
        { name: 'stockMinimo', label: 'Stock Mínimo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'costo', label: 'Costo', type: 'number', validation: { required: true, min: 0 } },
        { name: 'esInsumo', label: '¿Es Insumo?', type: 'checkbox', defaultValue: true },
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
        }
    };

    const handleFormSubmit = async (formData: Partial<ISupply>) => {
        if (supplyToEdit) {
            // Edición
            await updateItem(formData as ISupply); // Castea a ISupply ya que debería tener el ID
        } else {
            // Creación
            await createItem(formData as Omit<ISupply, 'id'>); // Castea a Omit<ISupply, 'id'>
        }
        setIsModalOpen(false);
        setSupplyToEdit(null); // Limpiar el estado de edición
    };

    if (loading && supplies.length === 0) return <p>Cargando insumos...</p>;
    if (error) return <p className="error-message">Error al cargar insumos: {error}</p>;

    return (
        <div className="supplies-page">
            <div className="page-header">
                <h2>Gestión de Insumos</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Nuevo Insumo
                </Button>
            </div>

            <GenericTable
                data={supplies}
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