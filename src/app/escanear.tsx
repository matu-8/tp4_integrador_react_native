import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { Stack, router, useFocusEffect } from 'expo-router';
import { tema } from '../constants/tema';

const ISBN_VALIDO = /^\d{13}$/;

export default function EscanearScreen() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [escaneando, setEscaneando] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      setEscaneando(true);
    }, []),
  );

  const manejarEscaneo = (resultado: BarcodeScanningResult) => {
    if (!escaneando) {
      return;
    }
    setEscaneando(false);

    const codigo = resultado.data.trim();
    if (ISBN_VALIDO.test(codigo)) {
      router.push(`/libro/${codigo}`);
      return;
    }

    Alert.alert('Código no válido', 'El código escaneado no es un ISBN de 13 dígitos.', [
      { text: 'Reintentar', onPress: () => setEscaneando(true) },
    ]);
  };

  if (!permiso) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>Preparando la cámara...</Text>
      </View>
    );
  }

  if (!permiso.granted) {
    return (
      <View style={styles.centrado}>
        <Stack.Screen options={{ title: 'Escanear' }} />
        <Text style={styles.mensaje}>
          Necesitamos acceso a la cámara para escanear el código de barras del libro.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => (permiso.canAskAgain ? pedirPermiso() : router.push('/permisos/camara'))}
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Habilitar cámara</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: 'Escanear' }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000000',
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
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.fondo,
    padding: tema.espaciado.lg,
  },
  mensaje: {
    color: tema.colores.textoSecundario,
    fontSize: tema.tipografia.cuerpo.fontSize,
    textAlign: 'center',
    marginBottom: tema.espaciado.md,
  },
  boton: {
    backgroundColor: tema.colores.primario,
    paddingVertical: tema.espaciado.md,
    paddingHorizontal: tema.espaciado.lg,
    borderRadius: tema.radios.md,
    minHeight: tema.dimensiones.areaMinimaTactil,
    justifyContent: 'center',
  },
  textoBoton: {
    color: tema.colores.textoClaro,
    fontSize: tema.tipografia.cuerpo.fontSize,
    fontWeight: '600',
  },
});
