import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { buscarLibros } from '../lib/api';
import { tema } from '../constants/tema';
import type { Libro } from '../types';

const ESPERA_DEBOUNCE = 300;

export default function BuscarScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [texto, setTexto] = useState<string>(params.q ?? '');
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [busco, setBusco] = useState<boolean>(false);
  const peticionActual = useRef<number>(0);

  const ejecutarBusqueda = useCallback(async (termino: string) => {
    const id = peticionActual.current + 1;
    peticionActual.current = id;

    if (termino.trim().length === 0) {
      setResultados([]);
      setBuscando(false);
      setBusco(false);
      setError(null);
      return;
    }

    setBuscando(true);
    setError(null);
    setBusco(true);

    try {
      const respuesta = await buscarLibros(termino);
      if (peticionActual.current === id) {
        setResultados(respuesta);
        setBuscando(false);
      }
    } catch {
      if (peticionActual.current === id) {
        setError('No pudimos completar la búsqueda. Probá de nuevo.');
        setBuscando(false);
      }
    }
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      router.setParams({ q: texto });
      ejecutarBusqueda(texto);
    }, ESPERA_DEBOUNCE);

    return () => clearTimeout(temporizador);
  }, [texto, ejecutarBusqueda]);

  return (
    <View style={styles.contenedor}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Buscar',
          headerStyle: { backgroundColor: tema.colores.superficie },
          headerTintColor: tema.colores.texto,
        }}
      />

      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Título o autor"
        placeholderTextColor={tema.colores.textoSecundario}
        style={styles.entrada}
        autoCorrect={false}
        accessibilityLabel="Buscar libro por título o autor"
        returnKeyType="search"
      />

      {buscando ? (
        <View style={styles.centrado}>
          <ActivityIndicator color={tema.colores.primario} />
        </View>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.isbn}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${item.titulo}`}
              onPress={() => router.push(`/libro/${item.isbn}`)}
              style={styles.tarjeta}
            >
              <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
              <Text style={styles.tarjetaAutor}>{item.autor}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.mensaje}>
              {error ?? (busco ? 'No encontramos coincidencias.' : 'Escribí un título o autor para buscar.')}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
  },
  entrada: {
    margin: tema.espaciado.md,
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radios.md,
    paddingHorizontal: tema.espaciado.md,
    paddingVertical: tema.espaciado.sm,
    minHeight: tema.dimensiones.areaMinimaTactil,
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.texto,
  },
  centrado: {
    padding: tema.espaciado.lg,
    alignItems: 'center',
  },
  lista: {
    paddingHorizontal: tema.espaciado.md,
    paddingBottom: tema.espaciado.xxl,
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
  tarjetaAutor: {
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
});
