// src/administracion-sistema/pages/CategoriesPage/CategoriesPage.tsx

import { useState, useMemo } from 'react';
import { GenericTable } from '../components/crud//GenericTable';
import type { ITableColumn } from '../components/crud//GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { categoryApi } from '../api/category';
import type { ICategory } from '../api/types/ICategory';
import { FormModal } from '../components/common/FormModal';
import { GenericForm } from '../components/crud/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../components/crud//GenericForm.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';

import './styles/crud-pages.css';

export const CategoriesPage: React.FC = () => {
    const {
        data: categories,
        loading,
        error,
        fetchData,
        createItem,
        updateItem,
    } = useCrud<ICategory>(categoryApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [forSaleFilter, setForSaleFilter] = useState('TODOS');

    // ESTADO PARA MODAL DE VISTA (SOLO LECTURA)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [categoryToView, setCategoryToView] = useState<ICategory | null>(null);

    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';

    const forSaleOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'SI', label: 'Para venta' },
        { value: 'NO', label: 'Para insumos' },
    ];

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

    const categoryFormFields: IFormFieldConfig[] = [
        { name: 'name', label: 'Nombre de la Categoría', type: 'text', validation: { required: true, minLength: 2 } },
        { name: 'forSale', label: '¿Para venta?', type: 'checkbox' },
    ];

    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type, checked, value } = e.target as HTMLInputElement;
        
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreate = () => {
        setCategoryToEdit(null);
        setFormValues({});
        setIsModalOpen(true);
    };

    const handleEdit = (item: ICategory) => {
        setCategoryToEdit(item);
        setFormValues({
            name: item.name,
            forSale: item.forSale
        });
        setIsModalOpen(true);
    };

    const handleView = (item: ICategory) => {
        setCategoryToView(item);
        setIsViewModalOpen(true);
    };

    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Validaciones
        if (!formValues.name || formValues.name.trim() === '') {
            alert('El nombre de la categoría es obligatorio');
            return;
        }

        if (categoryToEdit) {
            const updateData: ICategory = {
                id: categoryToEdit.id,
                IDCategory: categoryToEdit.IDCategory,
                name: formValues.name,
                forSale: formValues.forSale ?? false,
            };
            await updateItem(updateData);
        } else {
            const createData: Omit<ICategory, 'id'> = {
                IDCategory: 0,
                name: formValues.name,
                forSale: formValues.forSale ?? false,
            };
            
            try {
                await createItem(createData);
            } catch (error) {
                console.error('Error en createItem:', error);
                return;
            }
        }

        setIsModalOpen(false);
        setCategoryToEdit(null);
        setFormValues({});
        fetchData();
    };

    if (loading && categories.length === 0) return <p>Cargando categorías...</p>;
    if (error) return <p className="error-message">Error al cargar categorías: {error}</p>;

    return (
        <div className="crud-page-container">
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

            <GenericTable
                data={filteredCategories}
                columns={categoryColumns}
            />

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
                    <InputField
                        label="¿Para venta?"
                        name="forSale"
                        type="checkbox"
                        value={formValues.forSale ?? false}
                        onChange={handleInputChange}
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

            {/* MODAL SOLO LECTURA */}
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
                    </>
                )}
            </FormModal>
        </div>
    );
};
