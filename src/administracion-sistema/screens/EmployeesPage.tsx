import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { FormModal } from '../components/common/FormModal';
import type { ISelectOption } from '../components/crud/GenericForm.types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { employeeApi } from '../api/employee';
import type { IEmployee } from '../api/types/IEmployee';

import './styles/crud-pages.css';

export const EmployeesPage: React.FC = () => {
    // Estados para datos y carga
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estados para modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<IEmployee | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [employeeToView, setEmployeeToView] = useState<IEmployee | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para manejar los valores del formulario
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

    // Verificar permisos de usuario
    const role = localStorage.getItem("employeeRole");
    const isAdmin = role === 'ADMIN';

    // Opciones para los select
    const roleOptions: ISelectOption[] = [
        { value: '', label: 'Seleccionar rol' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'CASHIER', label: 'Cajero' },
        { value: 'CHEF', label: 'Cocinero' },
        { value: 'DRIVER', label: 'Repartidor' },
    ];

    const shiftOptions: ISelectOption[] = [
        { value: '', label: 'Seleccionar turno' }, 
        { value: 'MORNING', label: 'Mañana' },
        { value: 'EVENING', label: 'Tarde' }, 
        { value: 'NIGHT', label: 'Noche' },
    ];

    // Función para obtener empleados del backend
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

    // Filtrar empleados por término de búsqueda
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

    // Configuración de columnas para la tabla
    const employeeColumns: ITableColumn<IEmployee>[] = [
        { id: 'id', label: '#', numeric: true },
        { id: 'name', label: 'Nombre' },
        { id: 'lastName', label: 'Apellido' },
        { id: 'email', label: 'Correo' },
        { id: 'phoneNumber', label: 'Teléfono' },
        { id: 'employeeRole', label: 'Rol' },
        { id: 'shift', label: 'Turno' },
        ...(isAdmin
            ? [{
                id: 'acciones' as const,
                label: 'Acciones',
                render: (item: IEmployee) => (
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

    // Maneja cambios en los inputs del formulario
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Abre modal para crear nuevo empleado
    const handleCreate = () => {
        setEmployeeToEdit(null);
        setFormValues({});
        setIsModalOpen(true);
    };

    // Abre modal para editar empleado existente
    const handleEdit = (employee: IEmployee) => {
        setEmployeeToEdit(employee);
        setFormValues({
            name: employee.name,
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            birthDate: employee.birthDate,
            employeeRole: employee.employeeRole,
            shift: employee.shift,
            salary: employee.salary,
            username: employee.username,
            password: '', // No prellenar password por seguridad
        });
        setIsModalOpen(true);
    };

    // Abre modal de vista solo lectura
    const handleView = (employee: IEmployee) => {
        setEmployeeToView(employee);
        setIsViewModalOpen(true);
    };

    // Función para formatear fecha a formato legible
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString; // Si hay error, mostrar la fecha original
        }
    };

    // Maneja el envío del formulario tanto para crear como para editar
    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Validaciones básicas
        const requiredFields = ['name', 'lastName', 'phoneNumber', 'email', 'birthDate', 'employeeRole', 'shift', 'salary', 'username'];
        
        for (const field of requiredFields) {
            if (!formValues[field] || formValues[field].toString().trim() === '') {
                alert(`El campo "${field}" es obligatorio`);
                return;
            }
        }

        // Validar password solo para creación
        if (!employeeToEdit && (!formValues.password || formValues.password.trim() === '')) {
            alert('La contraseña es obligatoria para crear un nuevo empleado');
            return;
        }

        try {
            if (employeeToEdit) {
                // Modo edición - actualizar empleado existente
                const updateData: IEmployee = {
                    ...employeeToEdit,
                    name: formValues.name,
                    lastName: formValues.lastName,
                    phoneNumber: formValues.phoneNumber,
                    email: formValues.email,
                    birthDate: formValues.birthDate,
                    employeeRole: formValues.employeeRole,
                    shift: formValues.shift,
                    salary: parseFloat(formValues.salary),
                    username: formValues.username,
                    password: formValues.password && formValues.password.length > 0 ? formValues.password : employeeToEdit.password,
                };
                await employeeApi.update(updateData);
            } else {
                // Modo creación - crear nuevo empleado
                const createData = {
                    name: formValues.name,
                    lastName: formValues.lastName,
                    phoneNumber: formValues.phoneNumber,
                    email: formValues.email,
                    birthDate: formValues.birthDate,
                    employeeRole: formValues.employeeRole,
                    shift: formValues.shift,
                    salary: parseFloat(formValues.salary),
                    username: formValues.username,
                    password: formValues.password,
                    domiciles: [],
                } as Omit<IEmployee, 'id'>;
                
                await employeeApi.create(createData);
            }

            // Cerrar modal y limpiar estados después del envío exitoso
            setIsModalOpen(false);
            setEmployeeToEdit(null);
            setFormValues({});
            fetchEmployees();
        } catch (error) {
            console.error('Error al guardar empleado:', error);
            alert('Error al guardar empleado: ' + (error as Error).message);
        }
    };

    // Estados de carga y error
    if (loading && employees.length === 0) return <p>Cargando empleados...</p>;
    if (error) return <p className="error-message">Error al cargar empleados: {error}</p>;

    return (
        <div className="crud-page-container">
            {/* Controles de filtro y botón de crear */}
            <div className="filter-controls">
                {isAdmin && (
                    <Button variant="primary" onClick={handleCreate}>Nuevo Empleado</Button>
                )}
                <InputField
                    name="search"
                    type="search"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Tabla principal con datos filtrados */}
            <GenericTable
                data={filteredEmployees}
                columns={employeeColumns}
            />

            {/* Modal para crear/editar empleados */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={employeeToEdit ? 'Editar Empleado' : 'Crear Empleado'}
                onSubmit={undefined}
            >
                <form onSubmit={handleFormSubmit}>
                    <InputField
                        label="Nombre"
                        name="name"
                        type="text"
                        value={formValues.name ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Apellido"
                        name="lastName"
                        type="text"
                        value={formValues.lastName ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Teléfono"
                        name="phoneNumber"
                        type="text"
                        value={formValues.phoneNumber ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Correo"
                        name="email"
                        type="email"
                        value={formValues.email ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Fecha de nacimiento"
                        name="birthDate"
                        type="date"
                        value={formValues.birthDate ?? ''}
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="Rol"
                        name="employeeRole"
                        options={roleOptions}
                        value={formValues.employeeRole ?? ''}
                        onChange={handleInputChange}
                    />
                    <SelectField
                        label="Turno"
                        name="shift"
                        options={shiftOptions}
                        value={formValues.shift ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Salario"
                        name="salary"
                        type="number"
                        value={formValues.salary ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Usuario"
                        name="username"
                        type="text"
                        value={formValues.username ?? ''}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formValues.password ?? ''}
                        onChange={handleInputChange}
                        placeholder={employeeToEdit ? "Dejar vacío para mantener actual" : ""}
                    />
                    <Button 
                        type="submit" 
                        variant="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            handleFormSubmit();
                        }}
                    >
                        {employeeToEdit ? 'Actualizar Empleado' : 'Crear Empleado'}
                    </Button>
                </form>
            </FormModal>

            {/* Modal de vista solo lectura */}
            <FormModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalle del Empleado"
                onSubmit={undefined}
            >
                {employeeToView && (
                    <>
                        <InputField label="ID" name="id" type="text" value={employeeToView.id ?? ''} disabled />
                        <InputField label="Nombre" name="name" type="text" value={employeeToView.name ?? ''} disabled />
                        <InputField label="Apellido" name="lastName" type="text" value={employeeToView.lastName ?? ''} disabled />
                        <InputField label="Correo" name="email" type="text" value={employeeToView.email ?? ''} disabled />
                        <InputField label="Teléfono" name="phoneNumber" type="text" value={employeeToView.phoneNumber ?? ''} disabled />
                        <InputField label="Rol" name="employeeRole" type="text" value={employeeToView.employeeRole ?? ''} disabled />
                        <InputField label="Turno" name="shift" type="text" value={employeeToView.shift ?? ''} disabled />
                        <InputField label="Salario" name="salary" type="text" value={`$${employeeToView.salary?.toLocaleString() ?? '0'}`} disabled />
                        <InputField label="Usuario" name="username" type="text" value={employeeToView.username ?? ''} disabled />
                        <InputField 
                            label="Fecha de nacimiento" 
                            name="birthDate" 
                            type="text" 
                            value={formatDate(employeeToView.birthDate)} 
                            disabled 
                        />
                    </>
                )}
            </FormModal>
        </div>
    );
};
