import { useEffect, useState } from 'react';
import type { IArticle } from '../../api/types/IArticle';

type IngredienteConCantidad = { ingrediente: IArticle; cantidad: number };

interface Props {
    ingredientesAll: IArticle[];
    selectedIngredientes: IngredienteConCantidad[];
    onIngredientesChange: (ingredientes: IngredienteConCantidad[]) => void;
    onPriceChange?: (price: number) => void;
}

const IngredienteDelProductoForm: React.FC<Props> = ({
    ingredientesAll,
    selectedIngredientes,
    onIngredientesChange,
    onPriceChange,
}) => {
    // Estado local para el precio personalizado
    const [customPrice, setCustomPrice] = useState<string>('');

    // Agregar un ingrediente nuevo
    const handleAdd = () => {
        if (ingredientesAll.length === 0) return;
        onIngredientesChange([
            ...selectedIngredientes,
            { ingrediente: ingredientesAll[0], cantidad: 1 }
        ]);
    };

    // Cambiar ingrediente o cantidad
    const handleChange = (idx: number, field: 'ingrediente' | 'cantidad', value: any) => {
        const updated = [...selectedIngredientes];
        if (field === 'ingrediente') {
            const found = ingredientesAll.find(i => i.idarticle === Number(value));
            if (found) updated[idx].ingrediente = found;
        } else {
            updated[idx].cantidad = Number(value);
        }
        onIngredientesChange(updated);
    };

    // Quitar ingrediente
    const handleRemove = (idx: number) => {
        const updated = selectedIngredientes.filter((_, i) => i !== idx);
        onIngredientesChange(updated);
    };

    // Calcular precio total de los ingredientes
    const calcularPrecioTotal = () => {
        return selectedIngredientes.reduce((total, item) => {
            const precio = item.ingrediente.buyingPrice || 0;
            return total + (precio * item.cantidad);
        }, 0);
    };

    // Calcular precio sugerido (costo + 25%)
    const calcularPrecioSugerido = () => {
        const costoBase = calcularPrecioTotal();
        return costoBase * 1.25;
    };

    // Manejar cambio en el precio personalizado
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomPrice(value);
        const price = value === '' ? calcularPrecioSugerido() : parseFloat(value) || 0;
        onPriceChange?.(price);
    };

    // Enviar precio sugerido automáticamente solo si el usuario no ingresó uno
    useEffect(() => {
        if (customPrice === '') {
            const precioSugerido = calcularPrecioSugerido();
            onPriceChange?.(precioSugerido);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIngredientes]);

    // Si el padre edita un producto, inicializar el precio personalizado
    useEffect(() => {
        setCustomPrice('');
    }, [ingredientesAll, selectedIngredientes.length === 0]);

    return (
        <div>
            <label style={{marginBottom: 8, display: 'block' }}>Ingredientes del producto</label>
            
            {/* Botón debajo del título */}
            <button
                type="button"
                onClick={handleAdd}
                style={{
                    display: 'block',
                    margin: '8px 0 16px 0',
                    padding: '8px 16px',
                    backgroundColor: '#f7b731',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.07)'
                }}
            >
                Agregar ingrediente
            </button>

            {selectedIngredientes.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <select
                        value={item.ingrediente.idarticle}
                        onChange={e => handleChange(idx, 'ingrediente', e.target.value)}
                    >
                        {ingredientesAll.map(ing => (
                            <option key={ing.idarticle} value={ing.idarticle}>
                                {ing.denomination} ({ing.measuringUnit?.unit || 'unidad'})
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={e => handleChange(idx, 'cantidad', e.target.value)}
                        style={{ width: 60 }}
                    />
                    <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        style={{
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            cursor: 'pointer'
                        }}
                    >
                        Quitar
                    </button>
                </div>
            ))}
            
            {/* Mostrar precio total de ingredientes */}
            <div style={{  
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                fontWeight: 'bold'
            }}>
                Costo total de ingredientes: ${calcularPrecioTotal().toFixed(2)}
            </div>

            {/* Input para precio personalizado del producto */}
            <div style={{ marginTop: 12 }}>
                <label>Precio del producto (opcional):</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Precio sugerido: $${calcularPrecioSugerido().toFixed(2)} (ingredientes + 15%)`}
                    value={customPrice}
                    onChange={handlePriceChange}
                    style={{ 
                        width: '100%', 
                        padding: 8, 
                        marginTop: 4,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        marginBottom: 20
                    }}
                />
            </div>
        </div>
    );
};

export default IngredienteDelProductoForm;