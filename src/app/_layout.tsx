import { useEffect } from 'react';
import { BibliotecaProvider } from '../context/BibliotecaContext';
import { NavegadorBiblioteca } from '../components/NavegadorBiblioteca';
import { configurarHandler } from '../lib/notificaciones';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    configurarHandler();
  }, []);

  return (
    <BibliotecaProvider>
      <NavegadorBiblioteca />
    </BibliotecaProvider>
  );
}
