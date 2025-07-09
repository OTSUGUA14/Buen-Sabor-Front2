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
import type { IFormFieldConfig } from '../components/crud//GenericForm.types';
import { InputField } from '../components/common/InputField';

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


    // ESTADO PARA MODAL DE VISTA (SOLO LECTURA)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [categoryToView, setCategoryToView] = useState<ICategory | null>(null);

    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';

    const filteredCategories = useMemo(() => {
        return categories
            .map((c: any) => ({
                ...c,
                id: c.idcategory,
                IDCategory: c.idcategory,
                isForSale: c.forSale,
            }))
            .filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [categories, searchTerm]);

    const categoryColumns: ITableColumn<ICategory>[] = [
        {
            id: 'IDCategory',
            label: '#',
            render: item => item.IDCategory,
        },
        { id: 'name', label: 'Nombre de Categoría' },
        {
            id: 'forSale',
            label: '¿En venta?',
            render: item => item.forSale ? 'Sí' : 'No',
        },
        ...(isAdmin
            ? [{
                id: 'acciones' as const, // <-- así TypeScript lo acepta
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
        { name: 'isForSale', label: '¿En venta?', type: 'checkbox' },
    ];

    const handleCreate = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    //  HANDLER PARA EL MODAL DE VISTA
    const handleView = (category: ICategory) => {
        setCategoryToView(category);
        setIsViewModalOpen(true);
    };

    const handleEdit = (item: ICategory) => {
        setCategoryToEdit(item);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData: Partial<ICategory>) => {
        const submitData: ICategory = {
            id: categoryToEdit?.id ?? 0,
            IDCategory: categoryToEdit?.IDCategory ?? 0,
            name: formData.name ?? '',
            forSale: formData.forSale ?? false,
        };

        if (categoryToEdit) {
            await updateItem(submitData);
        } else {
            const createData = {
                IDCategory: 0,
                name: formData.name ?? '',
                forSale: formData.forSale ?? false,
            };
            await createItem(createData);
        }

        setIsModalOpen(false);
        setCategoryToEdit(null);
        fetchData();
    };

    if (loading && categories.length === 0) return <p>Cargando categorías...</p>;
    if (error) return <p className="error-message">Error al cargar categorías: {error}</p>;

    return (
        <div className="crud-page-container">
            {/* <div className="page-header">
                <h2>CATEGORIAS</h2>
            </div> */}

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
            </div>

            <GenericTable
                data={filteredCategories}
                columns={categoryColumns}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={categoryToEdit ? 'Editar Categoría' : 'Crear Categoría'}
            >
                <GenericForm<ICategory>
                    initialData={categoryToEdit ?? undefined}
                    fieldsConfig={categoryFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={categoryToEdit ? 'Actualizar Categora' : 'Crear Categoría'}
                />
            </FormModal>


            {/* NUEVO MODAL SOLO LECTURA */}
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
                            label="¿En venta?"
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
