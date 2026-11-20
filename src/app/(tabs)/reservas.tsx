import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useLibros } from '../../hooks/useLibros';
import { usePermiso } from '../../hooks/usePermiso';
import { useBiblioteca, type Prestamo } from '../../context/BibliotecaContext';
import { tema } from '../../constants/tema';
import { programarRecordatorio, cancelarRecordatorio } from '../../lib/notificaciones';
import type { Libro } from '../../types';

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ReservasScreen() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { prestamos, avisos, esperaDe, estaEnEspera, posicionEnEspera, devolver, activarRecordatorio } =
    useBiblioteca();
  const { estado: estadoPermiso, pedirPermiso } = usePermiso('notificaciones');
  const [ocupado, setOcupado] = useState<string | null>(null);

  const buscarLibro = (isbn: string): Libro | undefined =>
    libros.find((item) => item.isbn === isbn);

  const alternarRecordatorio = async (prestamo: Prestamo, activo: boolean) => {
    const libro = buscarLibro(prestamo.isbn);
    const titulo = libro?.titulo ?? 'tu libro';

    if (!activo) {
      if (prestamo.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
      activarRecordatorio(prestamo.isbn, false, null);
      return;
    }

    setOcupado(prestamo.isbn);
    const concedido = estadoPermiso === 'concedido' ? true : await pedirPermiso();
    if (!concedido) {
      setOcupado(null);
      Alert.alert(
        'Notificaciones desactivadas',
        'Podés activarlas desde los ajustes del teléfono. Mientras tanto, los avisos aparecerán en esta pantalla.',
      );
      return;
    }

    const identificador = await programarRecordatorio(titulo);
    activarRecordatorio(prestamo.isbn, true, identificador);
    setOcupado(null);
  };

  const manejarDevolucion = async (prestamo: Prestamo) => {
    if (prestamo.notificacionId) {
      await cancelarRecordatorio(prestamo.notificacionId);
    }
    devolver(prestamo.isbn);
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.primario} />
        <Text style={styles.mensaje}>Cargando tus reservas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensajeError}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={reintentar} style={styles.botonPrimario}>
          <Text style={styles.textoBotonPrimario}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const reservasEnEspera = Object.keys(
    prestamos.reduce<Record<string, boolean>>((acumulado, prestamo) => {
      acumulado[prestamo.isbn] = true;
      return acumulado;
    }, {}),
  );

  const librosEnEspera = libros.filter(
    (libro) => estaEnEspera(libro.isbn) && !reservasEnEspera.includes(libro.isbn),
  );

  return (
    <FlatList
      data={prestamos}
      keyExtractor={(item) => item.isbn}
      contentContainerStyle={styles.contenido}
      ListHeaderComponent={
        <View>
          {avisos.length > 0 && (
            <View style={styles.avisosCaja}>
              <Text style={styles.avisosTitulo}>Avisos</Text>
              {avisos.map((aviso, indice) => (
                <Text key={`aviso-${indice}`} style={styles.avisoTexto}>
                  {aviso}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.seccionTitulo}>Mis préstamos</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.mensaje}>No tenés préstamos activos.</Text>
      }
      renderItem={({ item }) => {
        const libro = buscarLibro(item.isbn);
        return (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>{libro?.titulo ?? item.isbn}</Text>
            <Text style={styles.tarjetaMeta}>
              Devolución: {formatearFecha(item.fechaDevolucion)}
            </Text>

            <View style={styles.filaRecordar}>
              <Text style={styles.recordarTexto}>Recordarme</Text>
              <Switch
                value={item.recordar}
                disabled={ocupado === item.isbn}
                onValueChange={(valor) => alternarRecordatorio(item, valor)}
                trackColor={{ false: tema.colores.borde, true: tema.colores.disponibleFondo }}
                thumbColor={item.recordar ? tema.colores.disponible : tema.colores.deshabilitado}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => manejarDevolucion(item)}
              style={styles.botonSecundario}
            >
              <Text style={styles.textoBotonSecundario}>Devolver</Text>
            </Pressable>
          </View>
        );
      }}
      ListFooterComponent={
        <View>
          <Text style={[styles.seccionTitulo, styles.seccionTituloEspaciada]}>
            Reservas en espera
          </Text>
          {librosEnEspera.length === 0 ? (
            <Text style={styles.mensaje}>No tenés reservas en espera.</Text>
          ) : (
            librosEnEspera.map((libro) => (
              <View key={libro.isbn} style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>{libro.titulo}</Text>
                <Text style={styles.tarjetaMeta}>
                  Posición en la lista: {posicionEnEspera(libro.isbn)} de {esperaDe(libro.isbn).length}
                </Text>
              </View>
            ))
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.lg,
  },
  contenido: {
    padding: tema.espaciado.md,
    paddingBottom: tema.espaciado.xxl,
  },
  mensaje: {
    marginTop: tema.espaciado.md,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
  },
  mensajeError: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  seccionTitulo: {
    fontSize: tema.tipografia.titulo.fontSize,
    fontWeight: tema.tipografia.titulo.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.sm,
  },
  seccionTituloEspaciada: {
    marginTop: tema.espaciado.lg,
  },
  avisosCaja: {
    backgroundColor: tema.colores.esperaFondo,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.md,
    marginBottom: tema.espaciado.md,
  },
  avisosTitulo: {
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: tema.tipografia.subtitulo.fontWeight,
    color: tema.colores.espera,
    marginBottom: tema.espaciado.xs,
  },
  avisoTexto: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.texto,
  },
  tarjeta: {
    backgroundColor: tema.colores.superficie,
    borderRadius: tema.radios.md,
    padding: tema.espaciado.md,
    marginBottom: tema.espaciado.sm,
  },
  tarjetaTitulo: {
    fontSize: tema.tipografia.subtitulo.fontSize,
    fontWeight: tema.tipografia.subtitulo.fontWeight,
    color: tema.colores.texto,
  },
  tarjetaMeta: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.textoSecundario,
    marginTop: tema.espaciado.xs,
  },
  filaRecordar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tema.espaciado.md,
  },
  recordarTexto: {
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.texto,
  },
  botonSecundario: {
    marginTop: tema.espaciado.md,
    borderWidth: 1,
    borderColor: tema.colores.primario,
    borderRadius: tema.radios.md,
    paddingVertical: tema.espaciado.sm,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonSecundario: {
    color: tema.colores.primario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
  botonPrimario: {
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.sm,
    paddingHorizontal: tema.espaciado.lg,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
  },
  textoBotonPrimario: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
