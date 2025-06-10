import { useState } from 'react';
import type { IIngrediente } from '../../../api/types/IIngrediente';

interface ProductFormProps {
    ingredientesAll: IIngrediente[];
    selectedIngredientes: IIngrediente[];
    setSelectedIngredientes: React.Dispatch<React.SetStateAction<IIngrediente[]>>;
    onIngredientesChange: (ingredientes: IIngrediente[]) => void;
}


const IngredienteDelProductoForm: React.FC<ProductFormProps> = ({ ingredientesAll, onIngredientesChange }) => {
    const [selectedIngredientes, setSelectedIngredientes] = useState<string[]>(['']);

    const handleChange = (index: number, value: string) => {
        const newIngredientes = [...selectedIngredientes];
        newIngredientes[index] = value;

        if (index === selectedIngredientes.length - 1 && value.trim() !== '') {
            newIngredientes.push('');
        }

        setSelectedIngredientes(newIngredientes);

        if (onIngredientesChange) {
            const selectedIngredienteObjects = newIngredientes
                .filter(item => item.trim() !== '')
                .map(denomination =>
                    ingredientesAll.find(ing => ing.denomination === denomination)
                )
                .filter((item): item is IIngrediente => item !== undefined);
            onIngredientesChange(selectedIngredienteObjects);
        }

    };

    return (
        <>
            {selectedIngredientes.map((ingrediente, index) => (
                <select
                    key={index}
                    value={ingrediente}
                    onChange={(e) => handleChange(index, e.target.value)}
                >
                    <option value="">Seleccione un ingrediente</option>
                    {ingredientesAll.map(ing => (
                        <option key={ing.idArticulo} value={ing.denomination}>
                            {ing.denomination}
                        </option>
                    ))}
                </select>
            ))}
        </>
    );
};

export default IngredienteDelProductoForm;