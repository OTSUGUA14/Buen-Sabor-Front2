
import type { IArticle } from '../../../api/types/IArticle';

type IngredienteConCantidad = { ingrediente: IArticle; cantidad: number };

interface Props {
    ingredientesAll: IArticle[];
    selectedIngredientes: IngredienteConCantidad[];
    onIngredientesChange: (ingredientes: IngredienteConCantidad[]) => void;
}

const IngredienteDelProductoForm: React.FC<Props> = ({
    ingredientesAll,
    selectedIngredientes,
    onIngredientesChange,
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
                            <option key={ing.idarticle} value={ing.idarticle}>{ing.denomination}</option>
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
        </div>
    );
};

export default IngredienteDelProductoForm;