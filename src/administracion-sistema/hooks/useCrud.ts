
import { useState, useEffect, useCallback } from 'react';

export interface CrudApi<T extends { id: number }> {
    getAll : () => Promise<T[]>;
    getById : (id: number) => Promise<T | undefined | null>;
    create : (item: Omit<T, 'id'>) => Promise<T>;
    update  : (item: T) => Promise<T>;
}


export const useCrud = <T extends { id: number }>(
    api: CrudApi<T>,
    fetchOnMount: boolean = true
) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.getAll();
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Error al cargar datos.');
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (fetchOnMount) {
            fetchData();
        }
    }, [fetchData, fetchOnMount]);

    const createItem = useCallback(async (item: Omit<T, 'id'>) => {
        setLoading(true);
        setError(null);
        

        try {
            const newItem = await api.create(item);
            setData((prevData) => [...prevData, newItem]);
            return newItem;
        } catch (err: any) {
            setError(err.message || 'Error al crear el elemento.');
            console.error("Error creating item:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const updateItem = useCallback(async (item: T) => {
        setLoading(true);
        setError(null);
        try {
            const updatedItem = await api.update(item);
            setData((prevData) =>
                prevData.map((d) => (d.id === updatedItem.id ? updatedItem : d))
            );
            return updatedItem;
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el elemento.');
            console.error("Error updating item:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

 

    // Función para obtener un elemento por ID (utilizada en FormModal)
    const getItemById = useCallback(async (id: number): Promise<T | undefined> => {
        setLoading(true);
        setError(null);
        try {
            const item = await api.getById(id);
            return item || undefined;
        } catch (err: any) {
            setError(err.message || 'Error al obtener el elemento por ID.');
            console.error("Error fetching item by ID:", err);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [api]);

    return {
        data,
        loading,
        error,
        fetchData,
        createItem,
        updateItem,
        
        getItemById
    };
};