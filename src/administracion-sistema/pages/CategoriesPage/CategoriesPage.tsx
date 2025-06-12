// src/administracion-sistema/pages/CategoriesPage/CategoriesPage.tsx

import { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { categoryApi } from '../../api/category';
import type { ICategory } from '../../api/types/ICategory';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import '../crud-pages.css';

export const CategoriesPage: React.FC = () => {
    const {
        data: categories,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<ICategory>(categoryApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [categoryToDeleteId, setCategoryToDeleteId] = useState<number | null>(null);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const categoryColumns: ITableColumn<ICategory>[] = [
        { id: 'id', label: '#' },
        { id: 'name', label: 'Nombre de Categoría' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: item => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>
                        Editar
                    </Button>
                </div>
            ),
        },
    ];

    const categoryFormFields: IFormFieldConfig[] = [
        { name: 'name', label: 'Nombre de la Categoría', type: 'text', validation: { required: true, minLength: 2 } },
    ];

    const handleCreate = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: ICategory) => {
        setCategoryToEdit(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setCategoryToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDeleteId !== null) {
            await deleteItem(categoryToDeleteId);
            setIsConfirmDialogOpen(false);
            setCategoryToDeleteId(null);
            fetchData();
        }
    };

    const handleFormSubmit = async (formData: Partial<ICategory>) => {
        const submitData: ICategory = {
            id: categoryToEdit?.id ?? 0, 
            name: formData.name ?? '',
        };

        if (categoryToEdit) {
            await updateItem(submitData);
        } else {
            await createItem(submitData);
        }

        setIsModalOpen(false);
        setCategoryToEdit(null);
        fetchData();
    };

    if (loading && categories.length === 0) return <p>Cargando categorías...</p>;
    if (error) return <p className="error-message">Error al cargar categorías: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Categorías</h2>
                <Button variant="primary" onClick={handleCreate}>Nueva Categoría</Button>
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre..."
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

        </div>
    );
};
