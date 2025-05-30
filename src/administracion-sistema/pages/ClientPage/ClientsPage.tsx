import React, { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { clientApi } from '../../api/client'; // Importa la API de clientes
import type { IClient } from '../../api/types/IClient'; // Importa la interfaz de clientes
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import '../crud-pages.css'; 

export const ClientsPage: React.FC = () => {
    const {
        data: clients,
        loading,
        error,
        fetchData,
        deleteItem,
        updateItem,
    } = useCrud<IClient>(clientApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [clientToDeleteId, setClientToDeleteId] = useState<number | null>(null);
    const [clientToEdit, setClientToEdit] = useState<IClient | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const matchesSearch = client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.direccion.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || client.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [clients, searchTerm, statusFilter]);

    const clientColumns: ITableColumn<IClient>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'nombre', label: 'Nombre' },
        { id: 'correo', label: 'Correo' },
        { id: 'direccion', label: 'Dirección' },
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

    const clientFormFields: IFormFieldConfig[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'correo', label: 'Correo', type: 'email', validation: { required: true, pattern: /^\S+@\S+\.\S+$/ } },
        { name: 'direccion', label: 'Dirección', type: 'text', validation: { required: true, minLength: 5 } },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }],
            validation: { required: true }
        },
    ];

    const handleEdit = (client: IClient) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setClientToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (clientToDeleteId !== null) {
            await deleteItem(clientToDeleteId);
            setIsConfirmDialogOpen(false);
            setClientToDeleteId(null);
            fetchData();
        }
    };

    const handleFormSubmit = async (formData: Partial<IClient>) => {
        if (clientToEdit) {
            const submitData: IClient = {
                ...clientToEdit,
                ...formData,
                estado: formData.estado as 'Activo' | 'Inactivo',
            };
            await updateItem(submitData);
        }
        setIsModalOpen(false);
        setClientToEdit(null);
        fetchData();
    };

    if (loading && clients.length === 0) return <p>Cargando clientes...</p>;
    if (error) return <p className="error-message">Error al cargar clientes: {error}</p>;

    return (
        <div className="crud-page-container"> 
            <div className="page-header">
                <h2>Gestión de Clientes</h2>
                
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre, correo o dirección..."
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
                data={filteredClients}
                columns={clientColumns}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={clientToEdit ? 'Editar Cliente' : 'Crear Cliente (No Permitido)'}
            >
                <GenericForm<IClient>
                    initialData={clientToEdit || undefined}
                    fieldsConfig={clientFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={clientToEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
                />
            </FormModal>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
            />
        </div>
    );
};