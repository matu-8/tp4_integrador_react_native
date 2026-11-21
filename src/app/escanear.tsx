import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useLibros } from '../hooks/useLibros';
import { tema } from '../constants/tema';

const ISBN_VALIDO = /^\d{13}$/;

export default function EscanearScreen() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const { libros, cargando: cargandoCatalogo, error: errorCatalogo } = useLibros();
  const [escaneando, setEscaneando] = useState<boolean>(true);
  const [isbnManual, setIsbnManual] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      setEscaneando(true);
    }, []),
  );

  const procesarCodigo = (codigo: string) => {
    if (!escaneando) {
      return;
    }

    const valor = codigo.trim();
    if (!ISBN_VALIDO.test(valor)) {
      setEscaneando(false);
      Alert.alert('Código no válido', 'El ISBN debe tener 13 dígitos.', [
        { text: 'Reintentar', onPress: () => setEscaneando(true) },
      ]);
      return;
    }

    const catalogoListo = !cargandoCatalogo && !errorCatalogo;
    if (catalogoListo && !libros.some((libro) => libro.isbn === valor)) {
      setEscaneando(false);
      Alert.alert('Libro no encontrado', 'Ese ISBN no está en el catálogo de la biblioteca.', [
        { text: 'Seguir escaneando', onPress: () => setEscaneando(true) },
      ]);
      return;
    }

    setEscaneando(false);
    setIsbnManual('');
    router.push(`/libro/${valor}`);
  };

  const manejarEscaneo = (resultado: BarcodeScanningResult) => {
    procesarCodigo(resultado.data);
  };

  const conCamara = permiso?.granted === true;

  return (
    <View style={conCamara ? styles.contenedor : styles.contenedorSinCamara}>
      <Stack.Screen options={{ title: 'Escanear' }} />

      {conCamara && (
        <>
          <CameraView
            style={styles.camara}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={escaneando ? manejarEscaneo : undefined}
          />
          <View style={styles.overlay}>
            <View style={styles.marco} />
            <Text style={styles.ayuda}>Apuntá al código de barras del libro</Text>
          </View>
        </>
      )}

      <View style={[styles.panel, conCamara ? styles.panelSobreCamara : styles.panelSinCamara]}>
        {!conCamara && (
          <>
            <Text style={styles.mensaje}>
              {permiso === null
                ? 'Preparando la cámara...'
                : 'Sin cámara también podés encontrar el libro escribiendo su ISBN.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => (permiso?.canAskAgain ? pedirPermiso() : router.push('/permisos/camara'))}
              style={styles.botonCamara}
            >
              <Text style={styles.textoBotonCamara}>Habilitar cámara</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.etiqueta}>Escribí el ISBN de 13 dígitos</Text>
        <TextInput
          value={isbnManual}
          onChangeText={setIsbnManual}
          placeholder="Ej.: 9780201485677"
          placeholderTextColor={tema.colores.textoSecundario}
          keyboardType="number-pad"
          maxLength={13}
          accessibilityLabel="ISBN del libro"
          style={styles.entrada}
          onSubmitEditing={() => procesarCodigo(isbnManual)}
        />
        <Pressable
          accessibilityRole="button"
          disabled={isbnManual.trim().length === 0}
          onPress={() => procesarCodigo(isbnManual)}
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Buscar libro</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contenedorSinCamara: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
  },
  camara: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marco: {
    width: '70%',
    height: 140,
    borderWidth: 2,
    borderColor: tema.colores.textoClaro,
    borderRadius: tema.radios.lg,
  },
  ayuda: {
    marginTop: tema.espaciado.lg,
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
  },
  panel: {
    padding: tema.espaciado.md,
    backgroundColor: tema.colores.superficie,
  },
  panelSobreCamara: {
    borderTopLeftRadius: tema.radios.lg,
    borderTopRightRadius: tema.radios.lg,
  },
  panelSinCamara: {
    flex: 1,
    justifyContent: 'center',
  },
  mensaje: {
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  etiqueta: {
    color: tema.colores.texto,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
    marginBottom: tema.espaciado.xs,
  },
  entrada: {
    backgroundColor: tema.colores.fondo,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radios.md,
    paddingHorizontal: tema.espaciado.md,
    paddingVertical: tema.espaciado.sm,
    minHeight: tema.dimensiones.areaMinimaTactil,
    fontSize: tema.tipografia.cuerpo.fontSize,
    color: tema.colores.texto,
    marginBottom: tema.espaciado.sm,
  },
  botonCamara: {
    minHeight: tema.dimensiones.areaMinimaTactil,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tema.espaciado.md,
  },
  textoBotonCamara: {
    color: tema.colores.primario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
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
});
