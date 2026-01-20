'use client';

import { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/providers/AuthProvider';

type Level = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

interface ProposalFormData {
  title: string;
  text: string;
  level: Level;
  minWords: number;
  imageUrl: string;
}

export default function AddProposalPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ProposalFormData>({
    title: '',
    text: '',
    level: 'BASIC',
    minWords: 100,
    imageUrl: '',
  });

  // Verificar se o usuário é admin
  const isAdmin = user?.userType === 1;

  // Redirecionar se não for admin
  if (!isAdmin && user !== null) {
    router.push('/dashboard');
    return null;
  }

  const handleChange = (field: keyof ProposalFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validações básicas do frontend
      if (!formData.title.trim()) {
        setError('Título é obrigatório');
        setLoading(false);
        return;
      }

      if (formData.title.length > 100) {
        setError('Título deve ter no máximo 100 caracteres');
        setLoading(false);
        return;
      }

      if (!formData.text.trim()) {
        setError('Texto é obrigatório');
        setLoading(false);
        return;
      }

      if (formData.minWords < 1) {
        setError('Número mínimo de palavras deve ser maior que 0');
        setLoading(false);
        return;
      }

      // Preparar dados para envio
      const dataToSend = {
        title: formData.title.trim(),
        text: formData.text.trim(),
        level: formData.level,
        minWords: Number(formData.minWords),
        imageUrl: formData.imageUrl.trim() || null,
      };

      await api.post('/v1/proposal', dataToSend);

      setSuccess(true);
      setFormData({
        title: '',
        text: '',
        level: 'BASIC',
        minWords: 100,
        imageUrl: '',
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/proposals');
      }, 2000);

    } catch (err) {
      console.error('Erro ao criar proposta:', err);
      if (err.response?.status === 401) {
        setError('Você não tem permissão para criar propostas');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('Você não tem permissão para criar propostas');
      } else {
        setError(err.response?.data?.message || 'Erro ao criar proposta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/proposals')}
            sx={{ borderRadius: 2 }}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" fontWeight="600">
            Adicionar Nova Proposta
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Proposta criada com sucesso! Redirecionando...
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Título"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            sx={{ mb: 3 }}
            helperText={`${formData.title.length}/100 caracteres`}
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="Texto da Proposta"
            fullWidth
            required
            multiline
            rows={8}
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            sx={{ mb: 3 }}
            helperText="Descreva detalhadamente a proposta de redação"
          />

          <TextField
            select
            label="Nível"
            fullWidth
            required
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            sx={{ mb: 3 }}
          >
            <MenuItem value="BASIC">Básico (A1-A2)</MenuItem>
            <MenuItem value="INTERMEDIATE">Intermediário (B1-B2)</MenuItem>
            <MenuItem value="ADVANCED">Avançado (C1-C2)</MenuItem>
          </TextField>

          <TextField
            label="Número Mínimo de Palavras"
            type="number"
            fullWidth
            required
            value={formData.minWords}
            onChange={(e) => handleChange('minWords', parseInt(e.target.value) || 0)}
            sx={{ mb: 3 }}
            inputProps={{ min: 1 }}
            helperText="Quantidade mínima de palavras que a redação deve ter"
          />

          <TextField
            label="URL da Imagem (opcional)"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            sx={{ mb: 3 }}
            helperText="URL de uma imagem relacionada à proposta (opcional)"
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/proposals')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Proposta'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
