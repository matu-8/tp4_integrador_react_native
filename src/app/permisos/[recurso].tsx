import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { usePermiso, type RecursoPermiso } from '../../hooks/usePermiso';
import { tema } from '../../constants/tema';

const FRASES: Record<RecursoPermiso, string> = {
  camara: 'Usamos tu cámara para leer el código de barras del libro y abrir su detalle al instante.',
  notificaciones:
    'Usamos tus notificaciones para recordarte la devolución de tus préstamos a tiempo.',
};

export default function PermisoScreen() {
  const params = useLocalSearchParams<{ recurso?: string }>();
  const recurso: RecursoPermiso = params.recurso === 'notificaciones' ? 'notificaciones' : 'camara';
  const { estado, pedirPermiso, abrirAjustes } = usePermiso(recurso);

  const continuar = async () => {
    if (estado === 'bloqueado') {
      await abrirAjustes();
      return;
    }

    const concedido = estado === 'concedido' ? true : await pedirPermiso();
    if (!concedido) {
      return;
    }

    if (recurso === 'camara') {
      router.replace('/escanear');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: recurso === 'camara' ? 'Permiso de cámara' : 'Permiso de notificaciones' }} />

      <Text style={styles.titulo}>
        {recurso === 'camara' ? 'Permiso de cámara' : 'Permiso de notificaciones'}
      </Text>
      <Text style={styles.frase}>{FRASES[recurso]}</Text>

      {estado === 'cargando' ? (
        <ActivityIndicator color={tema.colores.primario} style={styles.cargando} />
      ) : (
        <Pressable accessibilityRole="button" onPress={continuar} style={styles.boton}>
          <Text style={styles.textoBoton}>
            {estado === 'bloqueado' ? 'Abrir Ajustes' : 'Continuar'}
          </Text>
        </Pressable>
      )}

      {estado === 'bloqueado' && (
        <Text style={styles.ayudaBloqueo}>
          El permiso está bloqueado. Podés habilitarlo desde los ajustes del teléfono.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.lg,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: tema.tipografia.encabezado.fontSize,
    fontWeight: tema.tipografia.encabezado.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.md,
  },
  frase: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    lineHeight: tema.tipografia.cuerpo.lineHeight,
    color: tema.colores.textoSecundario,
    marginBottom: tema.espaciado.xl,
  },
  cargando: {
    marginTop: tema.espaciado.lg,
  },
  boton: {
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.md,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
  ayudaBloqueo: {
    marginTop: tema.espaciado.md,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
  },
});
