import { useEffect } from 'react';
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

    // Calcular precio sugerido (costo + 15%)
    const calcularPrecioSugerido = () => {
        const costoBase = calcularPrecioTotal();
        return costoBase * 1.25;
    };

    // Manejar cambio en el precio personalizado
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const price = value === '' ? calcularPrecioSugerido() : parseFloat(value) || 0;
        onPriceChange?.(price);
    };

    // Enviar precio sugerido automáticamente cuando cambien los ingredientes
    useEffect(() => {
        const precioSugerido = calcularPrecioSugerido();
        onPriceChange?.(precioSugerido);
    }, [selectedIngredientes, onPriceChange]);

    return (
        <div>
            <label>Ingredientes del producto</label>
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
                    <button type="button" onClick={() => handleRemove(idx)}>Quitar</button>
                </div>
            ))}
            <button type="button" onClick={handleAdd}>Agregar ingrediente</button>
            
            {/* Mostrar precio total de ingredientes */}
            <div style={{ 
                marginTop: 16, 
                padding: 12, 
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
                    placeholder={`Precio sugerido: $${calcularPrecioSugerido().toFixed(2)}`}
                    onChange={handlePriceChange}
                    style={{ 
                        width: '100%', 
                        padding: 8, 
                        marginTop: 4,
                        border: '1px solid #ddd',
                        borderRadius: 4
                    }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                    Precio sugerido (costo %)
                </small>
            </div>
        </div>
    );
};

export default IngredienteDelProductoForm;