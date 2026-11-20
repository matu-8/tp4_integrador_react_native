import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useLibros } from '../hooks/useLibros';
import { useBiblioteca } from '../context/BibliotecaContext';
import { tema } from '../constants/tema';
import { enviarAvisoDisponible } from '../lib/notificaciones';
import type { Libro } from '../types';

export default function MostradorScreen() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { esperaDe, entregarSiguiente, agregarAviso, cerrarSesion } = useBiblioteca();
  const [procesando, setProcesando] = useState<string | null>(null);

  const conEspera = libros.filter((libro) => esperaDe(libro.isbn).length > 0);

  const entregar = async (libro: Libro) => {
    setProcesando(libro.isbn);
    const siguiente = entregarSiguiente(libro.isbn);
    setProcesando(null);

    if (!siguiente) {
      return;
    }

    await enviarAvisoDisponible(libro.titulo).catch(() => undefined);
    agregarAviso(`Se avisó a ${siguiente} que "${libro.titulo}" está disponible.`);
    Alert.alert('Entrega registrada', `Se avisó a ${siguiente} que "${libro.titulo}" está disponible.`);
  };

  const salir = () => {
    cerrarSesion();
    router.back();
  };

  return (
    <View style={styles.contenedor}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Mostrador',
          headerStyle: { backgroundColor: tema.colores.superficie },
          headerTintColor: tema.colores.texto,
        }}
      />

      <Text style={styles.titulo}>Listas de espera</Text>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={tema.colores.primario} />
        </View>
      ) : error ? (
        <View style={styles.centrado}>
          <Text style={styles.textoError}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={reintentar} style={styles.botonPrimario}>
            <Text style={styles.textoBotonPrimario}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={conEspera}
          keyExtractor={(item) => item.isbn}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const espera = esperaDe(item.isbn);
            return (
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
                <Text style={styles.tarjetaMeta}>Próximo: {espera[0] ?? '—'}</Text>
                <Text style={styles.tarjetaMeta}>
                  En espera: {espera.join(', ')}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={procesando === item.isbn}
                  onPress={() => entregar(item)}
                  style={styles.botonPrimario}
                >
                  <Text style={styles.textoBotonPrimario}>
                    {procesando === item.isbn ? 'Entregando...' : 'Entregar siguiente'}
                  </Text>
                </Pressable>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.mensaje}>No hay reservas en espera en este momento.</Text>
          }
        />
      )}

      <Pressable accessibilityRole="button" onPress={salir} style={styles.botonSalir}>
        <Text style={styles.textoBotonSalir}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.md,
  },
  titulo: {
    fontSize: tema.tipografia.titulo.fontSize,
    fontWeight: tema.tipografia.titulo.fontWeight,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.md,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoError: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  lista: {
    paddingBottom: tema.espaciado.lg,
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
  mensaje: {
    marginTop: tema.espaciado.lg,
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
  },
  botonPrimario: {
    marginTop: tema.espaciado.md,
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.sm,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonPrimario: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
  botonSalir: {
    paddingVertical: tema.espaciado.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonSalir: {
    color: tema.colores.error,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
