// src/administracion-sistema/pages/ProductsPage/ProductsPage.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { productApi } from '../../api/product';
import type { IProduct } from '../../api/types/IProduct';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import { getIngredientesAll } from '../../utils/Api';
import IngredienteDelProductoForm from '../../components/common/Producto/IngredienteDelProductoForm';
import type { IIngrediente } from '../../api/types/IIngrediente';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';

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
    const [selectedIngredientes, setSelectedIngredientes] = useState<IIngrediente[]>([]);
    const [ingredientesAll, setIngredientesAll] = useState<IIngrediente[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    useEffect(() => {
        const fetchIngredientes = async () => {
            const ingredientes = await getIngredientesAll();
            setIngredientesAll(ingredientes);
        };
        fetchIngredientes();
    }, []); 

    const productColumns: ITableColumn<IProduct>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'name', label: 'Nombre' },
        {
            id: 'manufacturedArticleDetail',
            label: 'Ingredientes',
            render: (item) => item.manufacturedArticleDetail.map(ing => ing.article.denomination).join(', ')
        },
        { id: 'price', label: 'Precio Venta', numeric: true, render: (item) => `$${item.price.toFixed(2)}` },
        {
            id: 'isAvailable',
            label: 'Estado',
            render: (item) => item.isAvailable ? 'Activo' : 'Desactivado'
        },
        { id: 'estimatedTimeMinutes', label: 'Tiempo estimado', render: (item) => item.estimatedTimeMinutes },
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

    const productFormFields: IFormFieldConfig[] = useMemo(() => [
        { name: 'name', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'description',
            label: 'Descripción',
            type: 'textarea',
            validation: { required: true, minLength: 5 },
            placeholder: 'Ej: Jugosa hamburguesa con lechuga, tomate y queso.',
        },
        { name: 'price', label: 'Precio Venta', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'isAvailable',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
            ],
            validation: { required: true },
        },
    ], []);

    const handleCreate = () => {
        setProductToEdit(null);
        setSelectedIngredientes([]);
        setIsModalOpen(true);
    };

    const handleEdit = (product: IProduct) => {
        setProductToEdit(product);
        setSelectedIngredientes(
            product.manufacturedArticleDetail.map(ing => ing.article)
        );
        setIsModalOpen(true);
    };
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleDelete = (id: number) => {
        setProductToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (productToDeleteId !== null) {
            await deleteItem(productToDeleteId);
            setIsConfirmDialogOpen(false);
            setProductToDeleteId(null);
            fetchData();
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newProduct: IProduct = {
            id: productToEdit?.id || Math.floor(Math.random() * 1000000000),
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            stock: Number(formData.get('stock')),
            isAvailable: formData.get('isAvailable') === 'Activo',
            estimatedTimeMinutes: productToEdit?.estimatedTimeMinutes || 0,
            manufacturedArticleDetail: selectedIngredientes.map(ing => ({
                articleId: ing.id, // Ajusta según el campo real de ID
                quantity: 1,
                article: ing
            })),
        };

        if (productToEdit) {
            await updateItem(newProduct);
        } else {
            await createItem(newProduct);
        }

        setIsModalOpen(false);
        setProductToEdit(null);
        setSelectedIngredientes([]);
        fetchData();
    };

    if (loading && products.length === 0) return <p>Cargando productos...</p>;
    if (error) return <p className="error-message">Error al cargar productos: {error}</p>;

    return (
        <div className="crud-page-container">
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
                    placeholder="Buscar por nombre o ingredientes..."
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
            >
                <form onSubmit={handleFormSubmit}>
                    {productFormFields.map(field => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type as any}
                            placeholder={field.placeholder}
                            defaultValue={productToEdit ? (productToEdit as any)[field.name] : ''}
                        />
                    ))}
                    <IngredienteDelProductoForm
                        ingredientesAll={ingredientesAll}
                        setSelectedIngredientes={setSelectedIngredientes} // 💡 Agregado aquí
                        onIngredientesChange={setSelectedIngredientes}
                        selectedIngredientes={selectedIngredientes}
                    />
                    <Button variant="primary" type="submit">
                        {productToEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </form>
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
