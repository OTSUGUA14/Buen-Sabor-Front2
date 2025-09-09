// src/administracion-sistema/pages/CategoriesPage/CategoriesPage.tsx

import { useState, useMemo } from 'react';
import { GenericTable } from '../components/crud//GenericTable';
import type { ITableColumn } from '../components/crud//GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { categoryApi } from '../api/category';
import type { ICategory } from '../api/types/ICategory';
import { FormModal } from '../components/common/FormModal';
import type { ISelectOption } from '../components/crud//GenericForm.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';

import './styles/crud-pages.css';

export const CategoriesPage: React.FC = () => {
    // Hook personalizado que maneja las operaciones CRUD básicas
    const {
        data: categories,
        loading,
        error,
        fetchData,
        createItem,
        updateItem,
    } = useCrud<ICategory>(categoryApi);

    // Estados para los modales de crear/editar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    
    // Estados para filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [forSaleFilter, setForSaleFilter] = useState('TODOS');

    // Estados para modal de vista (solo lectura)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [categoryToView, setCategoryToView] = useState<ICategory | null>(null);

    // Verificar permisos de usuario desde localStorage
    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';

    // Opciones para el filtro de categorías en venta
    const forSaleOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'SI', label: 'Para venta' },
        { value: 'NO', label: 'Para insumos' },
    ];

    // Aplicar filtros de búsqueda y estado usando useMemo para optimizar rendimiento
    const filteredCategories = useMemo(() => {
        return categories
            .map((c: any) => ({
                ...c,
                id: c.idcategory,
                IDCategory: c.idcategory,
                isForSale: c.forSale,
            }))
            .filter(c => {
                const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
                
                let matchesForSale = true;
                if (forSaleFilter === 'SI') {
                    matchesForSale = c.forSale === true;
                } else if (forSaleFilter === 'NO') {
                    matchesForSale = c.forSale === false;
                }
                
                return matchesSearch && matchesForSale;
            });
    }, [categories, searchTerm, forSaleFilter]);

    // Configuración de columnas para la tabla
    const categoryColumns: ITableColumn<ICategory>[] = [
        {
            id: 'IDCategory',
            label: '#',
            render: item => item.IDCategory,
        },
        { id: 'name', label: 'Nombre de Categoría' },
        {
            id: 'forSale',
            label: 'Para venta?',
            render: item => item.forSale ? 'Sí' : 'No',
        },
        {
            id: 'enabled',
            label: 'Habilitada?',
            render: item => item.enabled ? 'Sí' : 'No',
        },
        // Solo mostrar acciones si el usuario es administrador
        ...(isAdmin
            ? [{
                id: 'acciones' as const,
                label: 'Acciones',
                render: (item: ICategory) => (
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

    // Estado para manejar los valores del formulario
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

    // Maneja cambios en los inputs del formulario
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type, checked, value } = e.target as HTMLInputElement;
        
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Abre modal para crear nueva categoría
    const handleCreate = () => {
        setCategoryToEdit(null);
        setFormValues({});
        setIsModalOpen(true);
    };

    // Abre modal para editar categoría existente
    const handleEdit = (item: ICategory) => {
        setCategoryToEdit(item);
        setFormValues({
            name: item.name,
            forSale: item.forSale,
            isEnabled: item.enabled, // <-- agregado
        });
        setIsModalOpen(true);
    };

    // Abre modal de vista solo lectura
    const handleView = (item: ICategory) => {
        setCategoryToView(item);
        setIsViewModalOpen(true);
    };

    // Maneja el envío del formulario tanto para crear como para editar
    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Validación básica del nombre
        if (!formValues.name || formValues.name.trim() === '') {
            alert('El nombre de la categoría es obligatorio');
            return;
        }

        if (categoryToEdit) {
            // Modo edición - actualizar categoría existente
            const updateData: ICategory = {
                id: categoryToEdit.id,
                IDCategory: categoryToEdit.IDCategory,
                name: formValues.name,
                forSale: formValues.forSale ?? false,
                enabled: formValues.isEnabled ?? true, // <-- usar isEnabled
            };
            await updateItem(updateData);
        } else {
            // Modo creación - crear nueva categoría
            const createData: Omit<ICategory, 'id'> = {
                IDCategory: 0,
                name: formValues.name,
                forSale: formValues.forSale ?? false,
                enabled: formValues.isEnabled ?? true, // <-- usar isEnabled
            };
            
            try {
                await createItem(createData);
            } catch (error) {
                console.error('Error en createItem:', error);
                return;
            }
        }

        // Cerrar modal y limpiar estados después del envío exitoso
        setIsModalOpen(false);
        setCategoryToEdit(null);
        setFormValues({});
        fetchData();
    };

    // Estados de carga y error
    if (loading && categories.length === 0) return <p>Cargando categorías...</p>;
    if (error) return <p className="error-message">Error al cargar categorías: {error}</p>;

    return (
        <div className="crud-page-container">
            {/* Controles de filtro y botón de crear */}
            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>Nueva Categoría</Button>
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
                    name="forSaleFilter"
                    options={forSaleOptions}
                    value={forSaleFilter}
                    onChange={(e) => setForSaleFilter(e.target.value)}
                    className="status-select"
                />
            </div>

            {/* Tabla principal con datos filtrados */}
            <GenericTable
                data={filteredCategories}
                columns={categoryColumns}
            />

            {/* Modal para crear/editar categorías */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={categoryToEdit ? 'Editar Categoría' : 'Crear Categoría'}
                onSubmit={undefined}
            >
                <form onSubmit={handleFormSubmit}>
                    <InputField
                        label="Nombre de la Categoría"
                        name="name"
                        type="text"
                        value={formValues.name ?? ''}
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="¿Para venta?"
                        name="forSale"
                        options={[
                            { value: 'true', label: 'Sí' },
                            { value: 'false', label: 'No' }
                        ]}
                        value={String(formValues.forSale ?? 'false')}
                        onChange={e => setFormValues(prev => ({
                            ...prev,
                            forSale: e.target.value === 'true'
                        }))}
                    />
                    <SelectField
                        label="Estado"
                        name="isEnabled"
                        options={[
                            { value: 'true', label: 'Activa' },
                            { value: 'false', label: 'Inactiva' }
                        ]}
                        value={String(formValues.isEnabled ?? 'true')}
                        onChange={e => setFormValues(prev => ({
                            ...prev,
                            isEnabled: e.target.value === 'true'
                        }))}
                    />
                    <Button 
                        type="submit" 
                        variant="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            handleFormSubmit();
                        }}
                    >
                        {categoryToEdit ? 'Actualizar Categoría' : 'Crear Categoría'}
                    </Button>
                </form>
            </FormModal>

            {/* Modal de vista solo lectura */}
            <FormModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalle de la Categoría"
                onSubmit={undefined}
            >
                {categoryToView && (
                    <>
                        <InputField
                            label="ID"
                            name="IDCategory"
                            type="text"
                            value={categoryToView.IDCategory ?? ''}
                            disabled
                        />
                        <InputField
                            label="Nombre de la Categoría"
                            name="name"
                            type="text"
                            value={categoryToView.name ?? ''}
                            disabled
                        />
                        <InputField
                            label="Para venta?"
                            name="forSale"
                            type="text"
                            value={categoryToView.forSale ? 'Sí' : 'No'}
                            disabled
                        />
                        <InputField
                            label="Estado"
                            name="enabled"
                            type="text"
                            value={categoryToView.enabled ? 'Activa' : 'Inactiva'}
                            disabled
                        />
                    </>
                )}
            </FormModal>
        </div>
    );
};
