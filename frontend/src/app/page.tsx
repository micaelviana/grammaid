'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import api from '@/utils/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se o usuário está autenticado usando a rota /me
        const response = await api.get('/v1/me');

        if (response.status === 200) {
          // Usuário autenticado, redirecionar para dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        // Não autenticado ou erro, redirecionar para login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Tela de loading enquanto verifica autenticação
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
