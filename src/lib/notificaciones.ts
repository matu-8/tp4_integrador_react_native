import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { Platform } from 'react-native';

const CANAL = 'prestamos';
const SEGUNDOS_DEMO = 15;

export function configurarHandler(): void {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function asegurarCanal(): Promise<void> {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync(CANAL, {
      name: 'Préstamos y Devoluciones',
      importance: AndroidImportance.HIGH,
    });
  }
}

export async function programarRecordatorio(titulo: string): Promise<string> {
  await asegurarCanal();
  return scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `No olvides devolver "${titulo}".`,
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_DEMO,
      channelId: CANAL,
    },
  });
}

export async function cancelarRecordatorio(identificador: string): Promise<void> {
  await cancelScheduledNotificationAsync(identificador).catch(() => undefined);
}

export async function cancelarNotificacionesHuerfanas(
  identificadoresValidos: string[],
): Promise<void> {
  const programadas = await getAllScheduledNotificationsAsync().catch(() => []);
  const validos = new Set(identificadoresValidos);

  await Promise.all(
    programadas
      .filter((notificacion) => !validos.has(notificacion.identifier))
      .map((notificacion) =>
        cancelScheduledNotificationAsync(notificacion.identifier).catch(() => undefined),
      ),
  );
}

export async function enviarAvisoDisponible(titulo: string): Promise<void> {
  await asegurarCanal();
  await scheduleNotificationAsync({
    content: {
      title: 'Tu reserva está disponible',
      body: `"${titulo}" te espera en el mostrador.`,
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId: CANAL,
    },
  });
}
