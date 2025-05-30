import React, { useState } from 'react';
import type { Ingrediente } from '../../../api/types/IIngrediente';

interface ProductFormProps {
    ingredientesAll: Ingrediente[];
    onIngredientesChange?: (ingredientes: string[]) => void;
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
            onIngredientesChange(newIngredientes.filter(item => item.trim() !== ''));
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
                        <option key={ing.idArticulo} value={ing.nombre}>
                            {ing.nombre}
                        </option>
                    ))}
                </select>
            ))}
        </>
    );
};

export default IngredienteDelProductoForm;