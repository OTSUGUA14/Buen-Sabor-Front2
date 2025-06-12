import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../../components/crud/GenericTable/GenericTable';
import type { ITableColumn } from '../../components/crud/GenericTable/GenericTable.types';
import { Button } from '../../components/common/Button/Button';
import { FormModal } from '../../components/common/FormModal/FormModal';
import { GenericForm } from '../../components/crud/GenericForm/GenericForm';
import type { IFormFieldConfig, ISelectOption } from '../../components/crud/GenericForm/GenericForm.types';
import { InputField } from '../../components/common/InputField/InputField';
import { employeeApi } from '../../api/employee';
import type { IEmployee } from '../../api/types/IEmployee';

import '../crud-pages.css';

export const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<IEmployee | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const roleOptions: ISelectOption[] = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'CASHIER', label: 'Cajero' },
        { value: 'CHEF', label: 'Cocinero' },
        { value: 'DRIVER', label: 'Repartidor' },
    ];

    const shiftOptions: ISelectOption[] = [
        { value: 'MORNING', label: 'Mañana' },
        { value: 'AFTERNOON', label: 'Tarde' },
        { value: 'NIGHT', label: 'Noche' },
    ];

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await employeeApi.getAll();
            setEmployees(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                emp.name.toLowerCase().includes(searchLower) ||
                emp.lastName.toLowerCase().includes(searchLower) ||
                emp.email.toLowerCase().includes(searchLower) ||
                emp.username.toLowerCase().includes(searchLower)
            );
        });
    }, [employees, searchTerm]);

    const employeeColumns: ITableColumn<IEmployee>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'name', label: 'Nombre' },
        { id: 'lastName', label: 'Apellido' },
        { id: 'email', label: 'Correo' },
        { id: 'phoneNumber', label: 'Teléfono' },
        { id: 'employeeRole', label: 'Rol' },
        { id: 'shift', label: 'Turno' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>Editar</Button>
                </div>
            ),
        },
    ];

    const employeeFormFields: IFormFieldConfig[] = [
        { name: 'name', label: 'Nombre', type: 'text', validation: { required: true, minLength: 2 } },
        { name: 'lastName', label: 'Apellido', type: 'text', validation: { required: true, minLength: 2 } },
        { name: 'phoneNumber', label: 'Teléfono', type: 'text', validation: { required: true } },
        { name: 'email', label: 'Correo', type: 'email', validation: { required: true, pattern: /^\S+@\S+\.\S+$/ } },
        { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date', validation: { required: true } },
        { name: 'employeeRole', label: 'Rol', type: 'select', options: roleOptions, validation: { required: true } },
        { name: 'shift', label: 'Turno', type: 'select', options: shiftOptions, validation: { required: true } },
        { name: 'salary', label: 'Salario', type: 'number', validation: { required: true, min: 0 } },
        { name: 'username', label: 'Usuario', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'password', label: 'Contraseña', type: 'password', validation: { required: !employeeToEdit, minLength: 6 } },
    ];

    const handleCreate = () => {
        setEmployeeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: IEmployee) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (formData: Partial<IEmployee>) => {
        try {
            if (employeeToEdit) {
                const updateData: IEmployee = {
                    ...employeeToEdit,
                    ...formData,
                    password: formData.password && formData.password.length > 0 ? formData.password : employeeToEdit.password,
                };
                await employeeApi.update(updateData);
            } else {
                const createData = {
                    ...formData,
                    domiciles: [],
                } as Omit<IEmployee, 'id'>;
                await employeeApi.create(createData);
            }
            setIsModalOpen(false);
            setEmployeeToEdit(null);
            fetchEmployees();
        } catch (err) {
            alert('Error al guardar empleado: ' + (err as Error).message);
        }
    };

    if (loading && employees.length === 0) return <p>Cargando empleados...</p>;
    if (error) return <p className="error-message">Error al cargar empleados: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Empleados</h2>
                <Button variant="primary" onClick={handleCreate}>Nuevo Empleado</Button>
            </div>

            <div className="filter-controls">
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar por nombre, apellido, correo o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <GenericTable
                data={filteredEmployees}
                columns={employeeColumns}
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
        </div>
    );
};
