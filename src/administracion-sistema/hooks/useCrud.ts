// src/administracion-sistema/hooks/useCrud.ts

import { useState, useEffect, useCallback } from 'react';

/**
 * @interface CrudApi
 * @description Interfaz genérica para las operaciones CRUD de una API.
 * @template T El tipo de la entidad.
 */
export interface CrudApi<T extends { id: number }> {
    getAll: () => Promise<T[]>;
    getById: (id: number) => Promise<T | undefined | null>; // <-- AHORA ACEPTA null O undefined
    create: (item: Omit<T, 'id'>) => Promise<T>;
    update: (item: T) => Promise<T>;
    delete: (id: number) => Promise<void>;
}

/**
 * @function useCrud
 * @description Hook personalizado para gestionar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
 * @template T El tipo de la entidad con la que trabaja el hook.
 * @param {CrudApi<T>} api - Un objeto que implementa la interfaz CrudApi para la entidad T.
 * @param {boolean} [fetchOnMount=true] - Si se deben cargar los datos al montar el componente.
 * @returns Un objeto con los datos, estados de carga y error, y funciones CRUD.
 */
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
            throw err; // Re-lanza el error para que el componente pueda manejarlo
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

    const deleteItem = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(id);
            setData((prevData) => prevData.filter((d) => d.id !== id));
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el elemento.');
            console.error("Error deleting item:", err);
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
            // Convertir null a undefined si la API devuelve null para "no encontrado"
            return item || undefined;
        } catch (err: any) {
            setError(err.message || 'Error al obtener el elemento por ID.');
            console.error("Error fetching item by ID:", err);
            return undefined; // Asegurarse de que siempre devuelva T | undefined en caso de error
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
        deleteItem,
        getItemById // Exportar esta función para uso externo, como en FormModal
    };
};