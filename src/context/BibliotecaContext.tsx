import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Cola, Pila } from '../estructuras';
import { ALUMNO } from '../constants/alumno';
import { CREDENCIALES_PERSONAL } from '../constants/personal';
import { cancelarNotificacionesHuerfanas } from '../lib/notificaciones';
import type { Libro } from '../types';

const DIAS_PRESTAMO = 7;
const MAX_RECIENTES = 3;

const CLAVES = {
  prestamos: '@biblioteca:prestamos',
  esperas: '@biblioteca:esperas',
  avisos: '@biblioteca:avisos',
} as const;

const ESPERAS_INICIALES: Record<string, string[]> = {
  '9780201485677': ['Lucía Gómez'],
  '9781491950296': ['Martín Sosa', 'Valentina Paz'],
};

export type Prestamo = {
  isbn: string;
  recordar: boolean;
  fechaDevolucion: string;
  notificacionId: string | null;
};

export type ResultadoReserva =
  | { tipo: 'prestamo' }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'duplicado' };

export type BibliotecaContexto = {
  sesionIniciada: boolean;
  hidratando: boolean;
  prestamos: Prestamo[];
  recientes: Libro[];
  avisos: string[];
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  registrarReciente: (libro: Libro) => void;
  reservar: (libro: Libro) => ResultadoReserva;
  devolver: (isbn: string) => void;
  tienePrestamo: (isbn: string) => boolean;
  estaEnEspera: (isbn: string) => boolean;
  posicionEnEspera: (isbn: string) => number;
  esperaDe: (isbn: string) => string[];
  ejemplaresDisponibles: (libro: Libro) => number;
  activarRecordatorio: (isbn: string, activo: boolean, notificacionId: string | null) => void;
  entregarSiguiente: (isbn: string) => string | null;
  agregarAviso: (mensaje: string) => void;
};

const ContextoBiblioteca = createContext<BibliotecaContexto | null>(null);

function calcularFechaDevolucion(): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + DIAS_PRESTAMO);
  return fecha.toISOString();
}

function parsear<T>(valor: string | null, fallback: T): T {
  if (!valor) {
    return fallback;
  }
  try {
    return JSON.parse(valor) as T;
  } catch {
    return fallback;
  }
}

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [sesionIniciada, setSesionIniciada] = useState<boolean>(false);
  const [hidratando, setHidratando] = useState<boolean>(true);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [recientes, setRecientes] = useState<Libro[]>([]);
  const [esperas, setEsperas] = useState<Record<string, string[]>>(ESPERAS_INICIALES);
  const [avisos, setAvisos] = useState<string[]>([]);

  useEffect(() => {
    let activo = true;

    (async () => {
      const resultados = await AsyncStorage.multiGet([
        CLAVES.prestamos,
        CLAVES.esperas,
        CLAVES.avisos,
      ]);
      if (!activo) {
        return;
      }

      const prestamosGuardados = parsear<Prestamo[]>(resultados[0][1], []);
      const esperasGuardadas = parsear<Record<string, string[]>>(
        resultados[1][1],
        ESPERAS_INICIALES,
      );
      const avisosGuardados = parsear<string[]>(resultados[2][1], []);

      setPrestamos(Array.isArray(prestamosGuardados) ? prestamosGuardados : []);
      setEsperas(
        esperasGuardadas && typeof esperasGuardadas === 'object'
          ? esperasGuardadas
          : ESPERAS_INICIALES,
      );
      setAvisos(Array.isArray(avisosGuardados) ? avisosGuardados : []);

      const identificadoresValidos = prestamosGuardados
        .filter((prestamo) => Boolean(prestamo?.notificacionId))
        .map((prestamo) => prestamo.notificacionId as string);
      await cancelarNotificacionesHuerfanas(identificadoresValidos);
    })()
      .catch(() => undefined)
      .finally(() => {
        if (activo) {
          setHidratando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (hidratando) {
      return;
    }
    AsyncStorage.multiSet([
      [CLAVES.prestamos, JSON.stringify(prestamos)],
      [CLAVES.esperas, JSON.stringify(esperas)],
      [CLAVES.avisos, JSON.stringify(avisos)],
    ]).catch(() => undefined);
  }, [hidratando, prestamos, esperas, avisos]);

  const iniciarSesion = useCallback((usuario: string, clave: string): boolean => {
    const valido =
      usuario.trim() === CREDENCIALES_PERSONAL.usuario &&
      clave === CREDENCIALES_PERSONAL.clave;
    if (valido) {
      setSesionIniciada(true);
    }
    return valido;
  }, []);

  const cerrarSesion = useCallback(() => {
    setSesionIniciada(false);
  }, []);

  const registrarReciente = useCallback((libro: Libro) => {
    setRecientes((previos) => {
      if (previos[0]?.isbn === libro.isbn) {
        return previos;
      }
      const pila = new Pila<Libro>();
      [...previos].reverse().forEach((item) => pila.apilar(item));
      const sinDuplicado = pila.aArray().filter((item) => item.isbn !== libro.isbn);
      const nuevaPila = new Pila<Libro>();
      sinDuplicado.forEach((item) => nuevaPila.apilar(item));
      nuevaPila.apilar(libro);
      return nuevaPila.aArray().slice(-MAX_RECIENTES).reverse();
    });
  }, []);

  const tienePrestamo = useCallback(
    (isbn: string) => prestamos.some((prestamo) => prestamo.isbn === isbn),
    [prestamos],
  );

  const estaEnEspera = useCallback(
    (isbn: string) => (esperas[isbn] ?? []).includes(ALUMNO.identificadorUsuario),
    [esperas],
  );

  const posicionEnEspera = useCallback(
    (isbn: string) => {
      const cola = esperas[isbn] ?? [];
      const indice = cola.indexOf(ALUMNO.identificadorUsuario);
      return indice === -1 ? 0 : indice + 1;
    },
    [esperas],
  );

  const esperaDe = useCallback((isbn: string) => esperas[isbn] ?? [], [esperas]);

  const ejemplaresDisponibles = useCallback(
    (libro: Libro) => {
      const ocupados = prestamos.filter((prestamo) => prestamo.isbn === libro.isbn).length;
      return Math.max(libro.ejemplares - ocupados, 0);
    },
    [prestamos],
  );

  const reservar = useCallback(
    (libro: Libro): ResultadoReserva => {
      if (tienePrestamo(libro.isbn) || estaEnEspera(libro.isbn)) {
        return { tipo: 'duplicado' };
      }

      const disponibles = ejemplaresDisponibles(libro);
      if (disponibles > 0) {
        setPrestamos((previos) => [
          ...previos,
          {
            isbn: libro.isbn,
            recordar: false,
            fechaDevolucion: calcularFechaDevolucion(),
            notificacionId: null,
          },
        ]);
        return { tipo: 'prestamo' };
      }

      const cola = new Cola<string>();
      (esperas[libro.isbn] ?? []).forEach((persona) => cola.encolar(persona));
      cola.encolar(ALUMNO.identificadorUsuario);
      const posicion = cola.tamanio;
      setEsperas((previas) => ({ ...previas, [libro.isbn]: cola.aArray() }));
      return { tipo: 'espera', posicion };
    },
    [ejemplaresDisponibles, esperas, estaEnEspera, tienePrestamo],
  );

  const devolver = useCallback((isbn: string) => {
    setPrestamos((previos) => previos.filter((prestamo) => prestamo.isbn !== isbn));
  }, []);

  const activarRecordatorio = useCallback(
    (isbn: string, activo: boolean, notificacionId: string | null) => {
      setPrestamos((previos) =>
        previos.map((prestamo) =>
          prestamo.isbn === isbn
            ? { ...prestamo, recordar: activo, notificacionId }
            : prestamo,
        ),
      );
    },
    [],
  );

  const entregarSiguiente = useCallback(
    (isbn: string): string | null => {
      const cola = new Cola<string>();
      (esperas[isbn] ?? []).forEach((persona) => cola.encolar(persona));
      const siguiente = cola.desencolar() ?? null;
      setEsperas((previas) => ({ ...previas, [isbn]: cola.aArray() }));
      return siguiente;
    },
    [esperas],
  );

  const agregarAviso = useCallback((mensaje: string) => {
    setAvisos((previos) => [mensaje, ...previos]);
  }, []);

  const valor = useMemo<BibliotecaContexto>(
    () => ({
      sesionIniciada,
      hidratando,
      prestamos,
      recientes,
      avisos,
      iniciarSesion,
      cerrarSesion,
      registrarReciente,
      reservar,
      devolver,
      tienePrestamo,
      estaEnEspera,
      posicionEnEspera,
      esperaDe,
      ejemplaresDisponibles,
      activarRecordatorio,
      entregarSiguiente,
      agregarAviso,
    }),
    [
      sesionIniciada,
      hidratando,
      prestamos,
      recientes,
      avisos,
      iniciarSesion,
      cerrarSesion,
      registrarReciente,
      reservar,
      devolver,
      tienePrestamo,
      estaEnEspera,
      posicionEnEspera,
      esperaDe,
      ejemplaresDisponibles,
      activarRecordatorio,
      entregarSiguiente,
      agregarAviso,
    ],
  );

  return <ContextoBiblioteca.Provider value={valor}>{children}</ContextoBiblioteca.Provider>;
}

export function useBiblioteca(): BibliotecaContexto {
  const contexto = useContext(ContextoBiblioteca);
  if (!contexto) {
    throw new Error('useBiblioteca debe usarse dentro de BibliotecaProvider');
  }
  return contexto;
}
