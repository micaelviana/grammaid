'use client';

import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, ArrowBack, MoreVert, Edit, Delete, Visibility, Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/providers/AuthProvider';

interface Essay {
  id: string;
  userId: string;
  proposalId: string;
  text: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
  createdAt: string;
  updatedAt: string;
  proposal: {
    id: string;
    title: string;
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  };
}

const statusLabels = {
  DRAFT: 'Rascunho',
  SUBMITTED: 'Enviada',
  REVIEWED: 'Corrigida',
};

const statusStyles = {
  DRAFT: {
    bgcolor: '#e3f2fd',
    color: '#1565c0',
  },
  SUBMITTED: {
    bgcolor: '#fff3e0',
    color: '#e65100',
  },
  REVIEWED: {
    bgcolor: '#e8f5e9',
    color: '#2e7d32',
  },
};

const levelLabels = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
};

export default function EssaysPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [filteredEssays, setFilteredEssays] = useState<Essay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEssay, setSelectedEssay] = useState<string | null>(null);

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        if (!user?.userId) {
          router.push('/login');
          return;
        }

        const response = await api.get(`/v1/essay?userId=${user.userId}`);
        setEssays(response.data);
        setFilteredEssays(response.data);
      } catch (err: any) {
        console.error('Erro ao carregar redações:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao carregar redações. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, [router, user]);

  // Filtrar redações por título da proposta quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEssays(essays);
    } else {
      const filtered = essays.filter((essay) =>
        essay.proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEssays(filtered);
    }
  }, [searchTerm, essays]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, essayId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedEssay(essayId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEssay(null);
  };

  const handleView = (essayId: string) => {
    handleMenuClose();

    // Find the essay to check its status
    const essay = essays.find((e) => e.id === essayId);

    if (!essay) return;

    // If essay is not reviewed yet (DRAFT or SUBMITTED), redirect to edit
    if (essay.status === 'DRAFT' || essay.status === 'SUBMITTED') {
      router.push(`/essays/new/${essay.proposalId}?essayId=${essayId}`);
    } else {
      // If REVIEWED, show the review page
      router.push(`/essays/review/${essayId}`);
    }
  };

  const handleEdit = (essayId: string) => {
    handleMenuClose();
    const essay = essays.find((e) => e.id === essayId);
    if (essay) {
      router.push(`/essays/new/${essay.proposalId}?essayId=${essayId}`);
    }
  };

  const handleDelete = async (essayId: string) => {
    handleMenuClose();
    if (!confirm('Tem certeza que deseja excluir esta redação?')) {
      return;
    }

    try {
      await api.delete(`/v1/essay/${essayId}`);
      setEssays(essays.filter((essay) => essay.id !== essayId));
    } catch (err) {
      console.error('Erro ao excluir redação:', err);
      alert('Erro ao excluir redação. Tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando redações...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              Voltar
            </Button>
            <Typography variant="h5" component="h1" fontWeight="600">
              Minhas Redações
            </Typography>
          </Box>

          <TextField
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {filteredEssays.length} {filteredEssays.length === 1 ? 'redação encontrada' : 'redações encontradas'}
        </Typography>
      </Box>

      {/* Lista de redações */}
      {filteredEssays.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEssays.map((essay) => (
            <Grid item xs={12} sm={6} md={4} key={essay.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  {/* Header com status e menu */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Chip
                      label={statusLabels[essay.status]}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: '22px',
                        bgcolor: statusStyles[essay.status].bgcolor,
                        color: statusStyles[essay.status].color,
                        fontWeight: 500,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, essay.id)}
                      sx={{ mt: -1, mr: -1 }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Título da proposta */}
                  <Typography variant="h6" component="h3" fontWeight="600" sx={{ fontSize: '1rem', mb: 1 }}>
                    {essay.proposal.title}
                  </Typography>

                  {/* Nível */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    Nível: {levelLabels[essay.proposal.level]}
                  </Typography>

                  {/* Informações */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {countWords(essay.text)} palavras
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(essay.updatedAt)}
                    </Typography>
                  </Box>

                  {/* Botão visualizar */}
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleView(essay.id)}
                    sx={{ mt: 1, borderRadius: 2, textTransform: 'none' }}
                  >
                    Visualizar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {essays.length === 0 ? (
            <>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Você ainda não tem redações
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece escrevendo sua primeira redação
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/proposals')}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Escrever Redação
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma redação encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tente buscar com outros termos
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedEssay && handleView(selectedEssay)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => selectedEssay && handleEdit(selectedEssay)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => selectedEssay && handleDelete(selectedEssay)} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>
    </Container>
  );
}
