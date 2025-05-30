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
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import { getIngredientesAll } from '../../utils/Api';
import IngredienteDelProductoForm from '../../components/common/Producto/IngredienteDelProductoForm';
import type { Ingrediente } from '../../api/types/IIngrediente';
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
    const [selectedIngredientes, setSelectedIngredientes] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [rubroFilter, setRubroFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];
    const [ingredientesAll, setIngredientesAll] = useState<Ingrediente[]>([]);


    useEffect(() => {
        const fetchIngredientes = async () => {
            const ingredientes = await getIngredientesAll();
            setIngredientesAll(ingredientes);
        };
        fetchIngredientes();
    }, []);

    // Definición de las opciones de rubro directamente en ProductsPage, similar a roleOptions
    const productRubrosValues: Array<IProduct['rubro']> = [
        'Hamburguesa',
        'Pizza',
        'Empanadas',
        'Postre ', // Nota el espacio aquí, asegúrate de que coincida exactamente con IProduct
        'Bebida',
        'Ensalada'
    ];

    const rubroOptions: ISelectOption[] = useMemo(() => [
        { value: 'TODOS', label: 'TODOS' },
        ...productRubrosValues.map(rubro => ({ value: rubro, label: rubro }))
    ], []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.rubro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.ingredientes.some(ing => ing.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'TODOS' || product.estado === statusFilter;
            const matchesRubro = rubroFilter === 'TODOS' || product.rubro === rubroFilter;
            return matchesSearch && matchesStatus && matchesRubro;
        });
    }, [products, searchTerm, statusFilter, rubroFilter]);

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




    // Quitamos ingredientes del array productFormFields:
    const productFormFields: IFormFieldConfig[] = useMemo(() => [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        {
            name: 'rubro',
            label: 'Rubro',
            type: 'select',
            options: rubroOptions.filter(opt => opt.value !== 'TODOS'),
            validation: { required: true }
        },
        {
            name: 'descripcion',
            label: 'Descripción',
            type: 'textarea',
            validation: { required: true, minLength: 5 },
            placeholder: 'Ej: Jugosa hamburguesa con lechuga, tomate y queso.',
        },
        { name: 'precioVenta', label: 'Precio Venta', type: 'number', validation: { required: true, min: 0 } },
        { name: 'ofertaPorcentaje', label: 'Oferta %', type: 'number', validation: { required: true, min: 0, max: 100 } },
        { name: 'stock', label: 'Stock', type: 'number', validation: { required: true, min: 0 } },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
            ],
            validation: { required: true }
        },
    ], [rubroOptions]);


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
            fetchData();
        }
    };

    const handleFormSubmit = async (formData: Partial<IProduct>) => {
        let ingredientesProcessed = selectedIngredientes.map((name, index) => ({
            id: Date.now() + index, // o la lógica de id que uses
            nombre: name
        }));

        const ingredientesRaw = formData.ingredientes as string[] | string | undefined;

        if (Array.isArray(ingredientesRaw) && ingredientesRaw.length > 0) {
            // Si es un array (multi-select), mapearlo
            ingredientesProcessed = ingredientesRaw.map((name: string, index: number) => ({
                id: productToEdit?.ingredientes?.[index]?.id || Date.now() + index,
                nombre: name,
            }));
        } else if (typeof ingredientesRaw === 'string' && ingredientesRaw.trim() !== '') {
            // Por compatibilidad: si es un string (single-select o legacy), convertirlo a array
            ingredientesProcessed = ingredientesRaw.split(',')
                .map((nameStr: string) => nameStr.trim())
                .filter((name: string) => name !== '')
                .map((name: string, index: number) => ({
                    id: productToEdit?.ingredientes?.[index]?.id || Date.now() + index,
                    nombre: name,
                }));
        } else if (productToEdit && !ingredientesRaw) {
            ingredientesProcessed = [];
        }

        const submitData: IProduct = {
            id: productToEdit?.id || Math.floor(Math.random() * 1000000000),
            nombre: formData.nombre!,
            descripcion: formData.descripcion || '',
            rubro: formData.rubro! as IProduct['rubro'],
            ingredientes: ingredientesProcessed,
            precioVenta: Number(formData.precioVenta),
            ofertaPorcentaje: Number(formData.ofertaPorcentaje),
            stock: Number(formData.stock),
            estado: formData.estado as 'Activo' | 'Inactivo',
        };

        if (productToEdit) {
            await updateItem(submitData);
        } else {
            await createItem(submitData);
        }
        setIsModalOpen(false);
        setProductToEdit(null);
        fetchData();
    };
    const handleFormSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Arma el objeto Partial<IProduct> desde el formulario:
        const formData = new FormData(e.currentTarget);
        const product: Partial<IProduct> = {
            nombre: formData.get("name") as string,
            precioVenta: Number(formData.get("price")),
            // ...
        };

        await handleFormSubmit(product);
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
                    placeholder="Buscar por nombre, rubro o ingredientes..."
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
                <form onSubmit={handleFormSubmitWrapper}>

                    {/* tus campos */}
                    {productFormFields.map(field => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type as any}
                            placeholder={field.placeholder}
                          
                        />
                    ))}

            
                    <IngredienteDelProductoForm
                        ingredientesAll={ingredientesAll}
                        onIngredientesChange={setSelectedIngredientes}
                    />

               
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