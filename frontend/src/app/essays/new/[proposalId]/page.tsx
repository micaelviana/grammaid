/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, Description, EmojiEvents } from '@mui/icons-material';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/providers/AuthProvider';

interface Proposal {
  id: string;
  title: string;
  text: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  minWords: number;
  imageUrl?: string;
}

const levelLabels = {
  BASIC: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
};

const levelStyles = {
  BASIC: {
    bgcolor: '#e8f5e9',
    color: '#2e7d32',
  },
  INTERMEDIATE: {
    bgcolor: '#fff9c4',
    color: '#8a5300',
  },
  ADVANCED: {
    bgcolor: '#ffebee',
    color: '#c62828',
  },
};


export default function NewEssayPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const proposalId = params.proposalId as string;
  const essayId = searchParams.get('essayId');
  const { user } = useContext(AuthContext);
  const userId = user?.userId;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [promotionData, setPromotionData] = useState<any>(null);
  const [reviewEssayId, setReviewEssayId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch proposal
        const proposalResponse = await api.get(`/v1/proposal/${proposalId}`);
        setProposal(proposalResponse.data);

        // If essayId is provided, fetch existing essay
        if (essayId) {
          const essayResponse = await api.get(`/v1/essay/${essayId}`);
          setEssayText(essayResponse.data.text);
          setIsEditMode(true);
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao carregar dados. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      fetchData();
    }
  }, [proposalId, essayId, router]);

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const wordCount = countWords(essayText);
  const charCount = essayText.length;
  const canFinalize = proposal && wordCount >= proposal.minWords;

  const handleSave = async () => {
    if (!canFinalize) return;

    if (!userId) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    setSaving(true);
    try {
      if (isEditMode && essayId) {
        // Update existing essay
        await api.put(`/v1/essay/${essayId}`, {
          text: essayText,
          status: 'DRAFT',
        });
      } else {
        // Create new essay
        const payload = {
          userId,
          proposalId,
          text: essayText,
          status: 'DRAFT',
        };
        await api.post('/v1/essay', payload);
      }

      // Redirect to essays list
      router.push('/essays');
    } catch (err: any) {
      console.error('Erro ao salvar redação:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError('Erro ao salvar redação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleClosePromotionDialog = () => {
    setShowPromotionDialog(false);
    if (reviewEssayId) {
      router.push(`/essays/review/${reviewEssayId}`);
    }
  };

  const handleSaveAndCorrect = async () => {
    if (!canFinalize) return;

    if (!userId) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        userId,
        proposalId,
        text: essayText,
      };

      console.log('Enviando para correção:', payload);

      // Chamar endpoint de correção
      const response = await api.post('/v1/essay/correct', payload);

      if (response.data.status === 'success') {
        // Verificar se houve promoção
        if (response.data.promotion?.promoted) {
          setPromotionData(response.data.promotion);
          setReviewEssayId(response.data.essayId);
          setShowPromotionDialog(true);
        } else {
          // Redirecionar para página de review
          router.push(`/essays/review/${response.data.essayId}`);
        }
      } else {
        throw new Error('Erro ao processar correção');
      }
    } catch (err: any) {
      console.error('Erro ao corrigir redação:', err);
      console.error('Response data:', err.response?.data);
      setError('Erro ao processar correção. Sua redação foi salva e você pode tentar novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando proposta...
        </Typography>
      </Container>
    );
  }

  if (error || !proposal) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Proposta não encontrada'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/proposals')}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/proposals')}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Chip
            label={levelLabels[proposal.level]}
            size="small"
            sx={{
              backgroundColor: levelStyles[proposal.level].bgcolor,
              color: levelStyles[proposal.level].color,
              fontWeight: 500,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            • {wordCount} palavras
          </Typography>
        </Box>

        <Typography variant="h5" component="h1" fontWeight="600" gutterBottom>
          {proposal.title}
        </Typography>
      </Box>

      {/* Texto Motivador */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderColor: 'divider',
          borderRadius: 4,
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Description fontSize="small" />
          <Typography variant="h6" fontWeight="500">
            Texto Motivador
          </Typography>
        </Box>

        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mb: 3, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
        >
          {proposal.text}
        </Typography>

        {/* Imagem de referência */}
        {proposal.imageUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontStyle: 'italic' }}
            >
              Imagem de referência:
            </Typography>
            <Box
              component="img"
              src={proposal.imageUrl}
              alt="Imagem de referência"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                maxHeight: 300,
              }}
            />
          </Box>
        )}

        {/* Dicas */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Dicas para uma boa redação:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Organize suas ideias antes de começar
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Use conectores para ligar as frases
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Revise a gramática e ortografia
            </Typography>
            <Typography component="li" variant="body2">
              Mantenha coerência no tema escolhido
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Sua Redação */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderColor: 'divider',
          borderRadius: 4,
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Typography variant="h6" fontWeight="500" gutterBottom>
          Sua Redação
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Escreva seu texto no espaço abaixo
        </Typography>

        <TextField
          multiline
          fullWidth
          rows={15}
          spellCheck={false}
          placeholder="Comece a escrever aqui..."
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            },
          }}
        />

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {wordCount} palavras • {charCount} caracteres
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              disabled={!canFinalize || saving}
              startIcon={saving ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              {saving ? 'Salvando...' : 'Salvar rascunho'}
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAndCorrect}
              disabled={!canFinalize || saving}
              startIcon={saving ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                backgroundColor: '#f20253',
                '&:hover': {
                  backgroundColor: '#d10247',
                },
              }}
            >
              {saving ? 'Corrigindo...' : 'Salvar e corrigir'}
            </Button>
          </Box>
        </Box>

        {proposal.minWords > wordCount && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: 'block', mt: 1, textAlign: 'right' }}
          >
            Mínimo de {proposal.minWords} palavras necessário
          </Typography>
        )}

        {saving && (
          <Typography
            variant="caption"
            color="primary"
            sx={{ display: 'block', mt: 1, textAlign: 'right' }}
          >
            Corrigindo redação... Isso pode levar até 3 minutos.
          </Typography>
        )}
      </Paper>

      {/* Dialog de Promoção */}
      <Dialog
        open={showPromotionDialog}
        onClose={handleClosePromotionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <EmojiEvents sx={{ fontSize: 80, color: '#ffd700', mb: 2 }} />
          <Typography variant="h5" fontWeight="600" color="primary">
            Parabéns! Você subiu de nível!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Você foi promovido de{' '}
            <strong>{levelLabels[promotionData?.oldLevel as keyof typeof levelLabels]}</strong> para{' '}
            <strong>{levelLabels[promotionData?.newLevel as keyof typeof levelLabels]}</strong>!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Média dos últimos 10 reviews: <strong>{promotionData?.averageScore?.toFixed(1)}%</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleClosePromotionDialog}
            sx={{
              borderRadius: 2,
              px: 4,
              backgroundColor: '#f20253',
              '&:hover': {
                backgroundColor: '#d10247',
              },
            }}
          >
            Ver correção
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
