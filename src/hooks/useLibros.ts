import { useCallback, useEffect, useState } from 'react';
import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

export interface UseLibrosResultado {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function useLibros(): UseLibrosResultado {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reintentarContador, setReintentarContador] = useState<number>(0);

  const reintentar = useCallback(() => {
    setReintentarContador((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerLibros();
        if (!cancelado) {
          setLibros(datos);
          setCargando(false);
        }
      } catch {
        if (!cancelado) {
          setError('No se pudo conectar con el catálogo de la biblioteca. Intentá de nuevo.');
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [reintentarContador]);

  return { libros, cargando, error, reintentar };
}
