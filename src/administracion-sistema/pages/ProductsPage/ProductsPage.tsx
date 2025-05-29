// src/administracion-sistema/pages/ProductsPage/ProductsPage.tsx

import React, { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { productApi } from '../../api/product';
import type { IProduct } from '../../api/types/product';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import './ProductsPage.css';

export const ProductsPage: React.FC = () => {
    const {
        data: products,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<IProduct>(productApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [productToDeleteId, setProductToDeleteId] = useState<number | null>(null);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');

    const statusOptions = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.rubro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // También buscamos en los nombres de ingredientes
                product.ingredientes.some(ing => ing.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'TODOS' || product.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, statusFilter]);

    const productColumns: ITableColumn<IProduct>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'nombre', label: 'Nombre' },
        { id: 'rubro', label: 'Rubro' },
        {
            id: 'ingredientes',
            label: 'Ingredientes',
            render: (item) => item.ingredientes.map(ing => ing.nombre).join(', ')
        },
        { id: 'precioVenta', label: 'Precio Venta', numeric: true, render: (item) => `$${item.precioVenta.toFixed(2)}` },
        { id: 'ofertaPorcentaje', label: 'Oferta %', numeric: true, render: (item) => `${item.ofertaPorcentaje}%` },
        { id: 'stock', label: 'Stock', numeric: true },
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

    const productFormFields: IFormFieldConfig[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'rubro', label: 'Rubro', type: 'text', validation: { required: true } },
        {
            name: 'ingredientes',
            label: 'Ingredientes (nombres separados por coma)',
            type: 'text',
            validation: { required: true },
            placeholder: 'Ej: Pan de papa, Medallon de carne, Lechuga',
            transformInitialValue: (value: any) => Array.isArray(value) ? value.map((ing: { nombre: string }) => ing.nombre).join(', ') : value,
        },
        { name: 'precioVenta', label: 'Precio Venta', type: 'number', validation: { required: true, min: 0 } },
        { name: 'ofertaPorcentaje', label: 'Oferta %', type: 'number', validation: { required: true, min: 0, max: 100 } },
        { name: 'stock', label: 'Stock', type: 'number', validation: { required: true, min: 0 } },
        { name: 'estado', label: 'Estado', type: 'select', options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }], validation: { required: true } },
    ];

    const handleCreate = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: IProduct) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setProductToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (productToDeleteId !== null) {
            await deleteItem(productToDeleteId);
            setIsConfirmDialogOpen(false);
            setProductToDeleteId(null);
        }
    };

    const handleFormSubmit = async (formData: Partial<IProduct>) => {
        let ingredientesProcessed: { id: number; nombre: string; }[] = [];

        // Aseguramos que formData.ingredientes es un string antes de operar sobre él.
        const ingredientesRaw = formData.ingredientes as string | undefined;

        if (ingredientesRaw && ingredientesRaw.trim() !== '') {
            ingredientesProcessed = ingredientesRaw.split(',')
                .map((nameStr: string) => nameStr.trim())
                .filter((name: string) => name !== '') // Filtra cualquier cadena vacía resultante de split (ej. ",," o "ing1,,ing2")
                .map((name: string, index: number) => ({
                    id: productToEdit?.ingredientes?.[index]?.id || Date.now() + index,
                    nombre: name,
                }));
        }

        // Construye el objeto final para el envío
        const submitData: IProduct = {
            // Si es edición, usa los datos existentes para preservar el ID y otros campos
            // Usamos productToEdit?.id para el ID, o un ID temporal para nuevos productos
            id: productToEdit?.id || Math.floor(Math.random() * 1000000000), // Genera un ID aleatorio para nuevos productos
            ...formData, // Esto sobrescribe las propiedades con los valores del formulario
            ingredientes: ingredientesProcessed, // Asegura que ingredientes sea el array procesado
            // Conversiones explícitas a Number
            precioVenta: Number(formData.precioVenta),
            ofertaPorcentaje: Number(formData.ofertaPorcentaje),
            stock: Number(formData.stock),
            // Casteo del estado
            estado: formData.estado as 'Activo' | 'Inactivo',
            nombre: formData.nombre!, // Asegura que nombre no sea undefined (requerido por IProduct)
            rubro: formData.rubro!   // Asegura que rubro no sea undefined (requerido por IProduct)
        };

        // Si formData.ingredientes es una cadena vacía y productToEdit tenía ingredientes, los borramos
        if (!ingredientesRaw && productToEdit && productToEdit.ingredientes.length > 0) {
            submitData.ingredientes = [];
        }


        if (productToEdit) {
            await updateItem(submitData);
        } else {
            // Al crear, el ID debería ser generado por la API, pero para el mock lo generamos aquí
            await createItem(submitData); // El createItem del hook ahora acepta Omit<IProduct, 'id'>
        }
        setIsModalOpen(false);
        setProductToEdit(null);
        fetchData();
    };

    if (loading && products.length === 0) return <p>Cargando productos...</p>;
    if (error) return <p className="error-message">Error al cargar productos: {error}</p>;

    return (
        <div className="products-page">
            <div className="page-header">
                <h2>Gestión de Productos</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Nuevo Producto
                </Button>
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre o rubro..."
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
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={productToEdit ? 'Editar Producto' : 'Crear Producto'}
            >
                <GenericForm<IProduct>
                    initialData={productToEdit || undefined}
                    fieldsConfig={productFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={productToEdit ? 'Actualizar Producto' : 'Crear Producto'}
                />
            </FormModal>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
            />
        </div>
    );
};