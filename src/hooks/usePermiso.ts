import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import type { PermissionResponse } from 'expo';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';
export type RecursoPermiso = 'camara' | 'notificaciones';

export interface UsePermisoResultado {
  estado: EstadoPermiso;
  pedirPermiso: () => Promise<boolean>;
  abrirAjustes: () => Promise<void>;
  consultar: () => Promise<void>;
}

function resolverEstado(respuesta: PermissionResponse | null, estaCargando: boolean): EstadoPermiso {
  if (estaCargando || !respuesta) {
    return 'cargando';
  }
  if (respuesta.granted || respuesta.status === 'granted') {
    return 'concedido';
  }
  if (respuesta.canAskAgain) {
    return 'preguntable';
  }
  return 'bloqueado';
}

export function usePermiso(recurso: RecursoPermiso): UsePermisoResultado {
  const [camPermiso, pedirCamPermiso, consultarCamPermiso] = useCameraPermissions();
  const [notifPermiso, setNotifPermiso] = useState<PermissionResponse | null>(null);
  const [notifCargando, setNotifCargando] = useState<boolean>(recurso === 'notificaciones');

  const consultar = useCallback(async () => {
    if (recurso === 'camara') {
      await consultarCamPermiso();
    } else {
      try {
        const res = await getPermissionsAsync();
        setNotifPermiso(res);
        setNotifCargando(false);
      } catch {
        setNotifCargando(false);
      }
    }
  }, [recurso, consultarCamPermiso]);

  useEffect(() => {
    let montado = true;

    if (recurso === 'notificaciones') {
      getPermissionsAsync()
        .then((res) => {
          if (montado) {
            setNotifPermiso(res);
            setNotifCargando(false);
          }
        })
        .catch(() => {
          if (montado) {
            setNotifCargando(false);
          }
        });
    }

    const suscripcion = AppState.addEventListener('change', (proximoEstado) => {
      if (proximoEstado === 'active' && montado) {
        if (recurso === 'camara') {
          consultarCamPermiso();
        } else {
          getPermissionsAsync()
            .then((res) => {
              if (montado) {
                setNotifPermiso(res);
              }
            })
            .catch(() => {
              // Silencioso al reanudar
            });
        }
      }
    });

    return () => {
      montado = false;
      suscripcion.remove();
    };
  }, [recurso, consultarCamPermiso]);

  const pedirPermiso = useCallback(async (): Promise<boolean> => {
    if (recurso === 'camara') {
      const res = await pedirCamPermiso();
      return res.granted || res.status === 'granted';
    }

    // Para Android: crear el canal "prestamos" antes de pedir el permiso (Regla 6.7)
    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('prestamos', {
        name: 'Préstamos y Devoluciones',
        importance: AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1D4ED8',
      });
    }

    const res = await requestPermissionsAsync();
    setNotifPermiso(res);
    setNotifCargando(false);
    return res.granted || res.status === 'granted';
  }, [recurso, pedirCamPermiso]);

  const abrirAjustes = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  const estado = recurso === 'camara'
    ? resolverEstado(camPermiso, !camPermiso)
    : resolverEstado(notifPermiso, notifCargando);

  return {
    estado,
    pedirPermiso,
    abrirAjustes,
    consultar,
  };
}
