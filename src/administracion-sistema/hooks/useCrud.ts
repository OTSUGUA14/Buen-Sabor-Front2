// src/administracion-sistema/hooks/useCrud.ts

import { useState, useEffect, useCallback } from 'react';

// Definición de la interfaz CrudApi para que TypeScript sepa qué esperar de tus APIs
interface CrudApi<T extends { id: any }> {
    getAll: () => Promise<T[]>;
    getById?: (id: T['id']) => Promise<T | undefined>; // Permite que getById retorne undefined si no lo encuentra
    create: (item: Omit<T, 'id'>) => Promise<T>; // 'create' no requiere 'id'
    update: (item: T) => Promise<T>; // 'update' sí requiere 'id'
    delete: (id: T['id']) => Promise<void>;
}

export const useCrud = <T extends { id: any }>(api: CrudApi<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.getAll();
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createItem = useCallback(async (item: Omit<T, 'id'>) => {
        setLoading(true);
        setError(null);
        try {
            const newItem = await api.create(item);
            setData((prevData) => [...prevData, newItem]);
            return newItem; // Devuelve el nuevo elemento creado
        } catch (err: any) {
            setError(err.message || 'Error al crear el elemento.');
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
            return updatedItem; // Devuelve el elemento actualizado
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el elemento.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const deleteItem = useCallback(async (id: T['id']) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(id);
            setData((prevData) => prevData.filter((d) => d.id !== id));
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el elemento.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    return { data, loading, error, fetchData, createItem, updateItem, deleteItem };
};