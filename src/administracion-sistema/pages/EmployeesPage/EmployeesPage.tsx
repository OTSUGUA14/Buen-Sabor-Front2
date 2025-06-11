// src/administracion-sistema/pages/EmployeesPage/EmployeesPage.tsx

import { useState, useMemo } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { useCrud } from '../../hooks/useCrud';
import { employeeApi } from '../../api/employee';
import type { IEmployee } from '../../api/types/IEmployee';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { SelectField } from '../../components/common/SelectField/SelectField';
import '../crud-pages.css'; 

export const EmployeesPage: React.FC = () => {
    const {
        data: employees,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<IEmployee>(employeeApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [employeeToDeleteId, setEmployeeToDeleteId] = useState<number | null>(null);
    const [employeeToEdit, setEmployeeToEdit] = useState<IEmployee | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [roleFilter, setRoleFilter] = useState('TODOS');

    const statusOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    const roleOptions: ISelectOption[] = [
        { value: 'TODOS', label: 'TODOS' },
        { value: 'Cajero', label: 'Cajero' },
        { value: 'Cocinero', label: 'Cocinero' },
        { value: 'Repartidor', label: 'Repartidor' },
        { value: 'Admin', label: 'Admin' },
    ];

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const matchesSearch = employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.direccion.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TODOS' || employee.estado === statusFilter;
            const matchesRole = roleFilter === 'TODOS' || employee.rol === roleFilter;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [employees, searchTerm, statusFilter, roleFilter]);

    const employeeColumns: ITableColumn<IEmployee>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'nombre', label: 'Nombre' },
        { id: 'correo', label: 'Correo' },
        { id: 'direccion', label: 'Dirección' },
        { id: 'estado', label: 'Estado' },
        { id: 'rol', label: 'Rol' },
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

    const employeeFormFields: IFormFieldConfig[] = [
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
        {
            name: 'rol',
            label: 'Rol',
            type: 'select',
            options: roleOptions.filter(opt => opt.value !== 'TODOS'), // Excluir 'TODOS' para el formulario
            validation: { required: true }
        },
    ];

    const handleCreate = () => {
        setEmployeeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: IEmployee) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setEmployeeToDeleteId(id);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (employeeToDeleteId !== null) {
            await deleteItem(employeeToDeleteId);
            setIsConfirmDialogOpen(false);
            setEmployeeToDeleteId(null);
            fetchData();
        }
    };

    const handleFormSubmit = async (formData: Partial<IEmployee>) => {
        if (employeeToEdit) {
            const submitData: IEmployee = {
                ...employeeToEdit,
                ...formData,
                estado: formData.estado as 'Activo' | 'Inactivo',
                rol: formData.rol as 'Cajero' | 'Cocinero' | 'Repartidor' | 'Admin',
            };
            await updateItem(submitData);
        } else {
            const submitData: Omit<IEmployee, 'id'> = {
                ...formData,
                estado: formData.estado as 'Activo' | 'Inactivo',
                rol: formData.rol as 'Cajero' | 'Cocinero' | 'Repartidor' | 'Admin',
            } as Omit<IEmployee, 'id'>; 
            await createItem(submitData);
        }
        setIsModalOpen(false);
        setEmployeeToEdit(null);
        fetchData();
    };

    if (loading && employees.length === 0) return <p>Cargando empleados...</p>;
    if (error) return <p className="error-message">Error al cargar empleados: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Empleados</h2>
                <Button variant="primary" onClick={handleCreate}>
                    Nuevo Empleado
                </Button>
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
                data={filteredEmployees}
                columns={employeeColumns}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={employeeToEdit ? 'Editar Empleado' : 'Crear Empleado'}
            >
                <GenericForm<IEmployee>
                    initialData={employeeToEdit || undefined}
                    fieldsConfig={employeeFormFields}
                    onSubmit={handleFormSubmit}
                    submitButtonText={employeeToEdit ? 'Actualizar Empleado' : 'Crear Empleado'}
                />
            </FormModal>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer."
            />
        </div>
    );
};