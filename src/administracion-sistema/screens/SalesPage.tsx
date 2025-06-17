import { useState, useMemo, useEffect } from 'react';
import { GenericTable } from '../components/crud/GenericTable';
import type { ITableColumn } from '../components/crud/GenericTable.types';
import { Button } from '../components/common/Button';
import { useCrud } from '../hooks/useCrud';
import { SaleType, type ISale } from '../api/types/ISale';
import { saleApi } from '../api/sale';
import { FormModal } from '../components/common/FormModal';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';

export const SalesPage: React.FC = () => {
    const {
        data: sales,
        loading,
        error,
        fetchData,
        deleteItem,
        createItem,
        updateItem,
    } = useCrud<ISale>(saleApi);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saleToEdit, setSaleToEdit] = useState<ISale | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Opciones para el select de tipo de oferta
    const saleTypeOptions = Object.values(SaleType).map(type => ({
        value: type,
        label: type
    }));

    // Columnas de la tabla
    const saleColumns: ITableColumn<ISale>[] = [
        { id: 'IDSale', label: '#', numeric: true },
        { id: 'denomination', label: 'Nombre' },
        { id: 'saleDescription', label: 'Descripción' },
        { id: 'salePrice', label: 'Precio Oferta', numeric: true, render: (item) => `$${item.salePrice.toFixed(2)}` },
        { id: 'saleType', label: 'Tipo', render: (item) => item.saleType },
        { id: 'startDate', label: 'Fecha Inicio' },
        { id: 'endDate', label: 'Fecha Fin' },
        { id: 'startTime', label: 'Hora Inicio' },
        { id: 'endTime', label: 'Hora Fin' },
        {
            id: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(item)}>Editar</Button>
                    <Button variant="danger" onClick={() => handleDelete(item.IDSale)}>Eliminar</Button>
                </div>
            ),
        },
    ];

    // Campos del formulario
    const saleFormFields = useMemo(() => [
        {
            name: 'denomination',
            label: 'Nombre',
            type: 'text',
            validation: { required: true, minLength: 3 }
        },
        {
            name: 'saleDescription',
            label: 'Descripción',
            type: 'textarea',
            validation: { required: true, minLength: 5 }
        },
        {
            name: 'salePrice',
            label: 'Precio Oferta',
            type: 'number',
            validation: { required: true, min: 0 }
        },
        {
            name: 'saleType',
            label: 'Tipo de Oferta',
            type: 'select',
            options: saleTypeOptions,
            validation: { required: true }
        },
        {
            name: 'startDate',
            label: 'Fecha Inicio',
            type: 'date',
            validation: { required: true }
        },
        {
            name: 'endDate',
            label: 'Fecha Fin',
            type: 'date',
            validation: { required: true }
        },
        {
            name: 'startTime',
            label: 'Hora Inicio',
            type: 'time',
            validation: { required: true }
        },
        {
            name: 'endTime',
            label: 'Hora Fin',
            type: 'time',
            validation: { required: true }
        },
        {
            name: 'inventoryImage',
            label: 'Imagen',
            type: 'file',
            accept: 'image/*',
        }
    ], [saleTypeOptions]);

    // Handlers
    const handleCreate = () => {
        setSaleToEdit(null);
        setFormValues({});
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sale: ISale) => {
        setSaleToEdit(sale);
        setFormValues({
            denomination: sale.denomination,
            saleDescription: sale.saleDescription,
            salePrice: sale.salePrice,
            saleType: sale.saleType,
            startDate: sale.startDate,
            endDate: sale.endDate,
            startTime: sale.startTime,
            endTime: sale.endTime,
            inventoryImage: null,
        });
        if (sale.inventoryImage?.imageData) {
            setImagePreview(`data:image/jpeg;base64,${sale.inventoryImage.imageData}`);
        } else {
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type } = e.target;
        let value: any;

        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            value = files && files.length > 0 ? files[0] : null;

            // Mostrar previsualización
            if (value) {
                const reader = new FileReader();
                reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                reader.readAsDataURL(value);
            } else {
                setImagePreview(null);
            }
        } else {
            value = e.target.value;
        }

        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id: number) => {
        await deleteItem(id);
        fetchData();
    };

    // Convertir File a Base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]); // Solo la parte base64
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFormSubmit = async () => {
        // Validar campos requeridos
        const requiredFields = ['denomination', 'saleDescription', 'salePrice', 'saleType', 'startDate', 'endDate', 'startTime', 'endTime'];
        for (const field of requiredFields) {
            if (!formValues[field] || (typeof formValues[field] === 'string' && formValues[field].trim() === '')) {
                alert(`El campo "${field}" es obligatorio.`);
                return;
            }
        }

        let inventoryImage = { imageData: '' };
        try {
            if (formValues.inventoryImage) {
                const base64Data = await convertFileToBase64(formValues.inventoryImage);
                inventoryImage = { imageData: base64Data };
            } else if (saleToEdit && saleToEdit.inventoryImage?.imageData) {
                inventoryImage = { imageData: saleToEdit.inventoryImage.imageData };
            }

            const newSale: any = {
                denomination: formValues.denomination,
                saleDescription: formValues.saleDescription,
                salePrice: parseFloat(formValues.salePrice),
                saleType: formValues.saleType,
                startDate: formValues.startDate,
                endDate: formValues.endDate,
                startTime: formValues.startTime,
                endTime: formValues.endTime,
                inventoryImage,
                manufacturedArticle: saleToEdit ? saleToEdit.manufacturedArticle : [], // Puedes agregar selección de productos aquí
            };

            if (saleToEdit) {
                newSale.IDSale = saleToEdit.IDSale;
                await updateItem(newSale);
            } else {
                await createItem(newSale);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Error al procesar el formulario.');
            console.error(error);
        }
    };

    // Renderizado
    if (loading && sales.length === 0) return <p>Cargando ofertas...</p>;
    if (error) return <p className="error-message">Error al cargar ofertas: {error}</p>;

    return (
        <div className="crud-page-container">
            <div className="page-header">
                <h2>Gestión de Ofertas</h2>
                <Button variant="primary" onClick={handleCreate}>Nueva Oferta</Button>
            </div>

            <GenericTable
                data={sales.map(sale => ({ ...sale, id: sale.IDSale }))}
                columns={saleColumns}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={saleToEdit ? 'Editar Oferta' : 'Crear Oferta'}
                onSubmit={handleFormSubmit}
            >
                {saleFormFields.map(field => {
                    const isFileInput = field.type === 'file';
                    return (
                        <InputField
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type as any}
                            placeholder={field.placeholder}
                            onChange={handleInputChange}
                            options={field.type === 'select' ? field.options || [] : undefined}
                            {...(!isFileInput ? { value: formValues[field.name] ?? '' } : {})}
                        />
                    );
                })}

                {/* Previsualización de la imagen */}
                {imagePreview && (
                    <div style={{ marginBottom: 16 }}>
                        <label>Vista previa de la imagen:</label>
                        <img
                            src={imagePreview}
                            alt="Vista previa"
                            style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                        />
                    </div>
                )}

                <Button variant="primary" type="submit">
                    {saleToEdit ? 'Actualizar' : 'Crear'}
                </Button>
            </FormModal>
        </div>
    );
};