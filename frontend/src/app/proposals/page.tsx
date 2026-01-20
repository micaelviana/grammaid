'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search, ArrowBack, Save } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import api from '@/utils/api';
import ProposalCard from '@/components/ProposalCard';
import { AuthContext } from '@/providers/AuthProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Proposal {
  id: string;
  title: string;
  text: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  minWords: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProposalsPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para edição
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [editForm, setEditForm] = useState({ title: '', text: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.userType === 1;

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await api.get('/v1/proposal');
        setProposals(response.data);
        setFilteredProposals(response.data);
      } catch (err: any) {
        console.error('Erro ao carregar propostas:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao carregar propostas. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [router]);

  // Filtrar propostas por título quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProposals(proposals);
    } else {
      const filtered = proposals.filter((proposal) =>
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProposals(filtered);
    }
  }, [searchTerm, proposals]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar esta proposta?')) {
      return;
    }

    try {
      await api.delete(`/v1/proposal/${id}`);
      setProposals(proposals.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao apagar proposta:', err);
      alert('Erro ao apagar proposta. Tente novamente.');
    }
  };

  const handleEditOpen = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setEditForm({ title: proposal.title, text: proposal.text, imageUrl: proposal.imageUrl || '' });
  };

  const handleEditClose = () => {
    setEditingProposal(null);
  };

  const handleSave = async () => {
    if (!editingProposal) return;

    setSaving(true);
    try {
      await api.put(`/v1/proposal/${editingProposal.id}`, {
        title: editForm.title,
        text: editForm.text,
        imageUrl: editForm.imageUrl,
      });

      setProposals(
        proposals.map((p) =>
          p.id === editingProposal.id
            ? { ...p, title: editForm.title, text: editForm.text, imageUrl: editForm.imageUrl }
            : p
        )
      );
      handleEditClose();
    } catch (err) {
      console.error('Erro ao atualizar proposta:', err);
      alert('Erro ao atualizar proposta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando propostas...
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho com botão voltar e busca */}
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
              Todas as Redações
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

        {/* Contador de resultados */}
        <Typography variant="body2" color="text.secondary">
          {filteredProposals.length} {filteredProposals.length === 1 ? 'proposta encontrada' : 'propostas encontradas'}
        </Typography>
      </Box>

      {/* Grid de propostas */}
      {filteredProposals.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProposals.map((proposal) => (
            <Grid item xs={12} sm={6} md={4} key={proposal.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <ProposalCard
                  id={proposal.id}
                  title={proposal.title}
                  text={proposal.text}
                  level={proposal.level}
                />
                {!isAdmin ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/essays/new/${proposal.id}`)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      py: 1,
                      borderRadius: 3,
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '3px solid #e0e0e0',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Escrever
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => router.push(`/essays/new/${proposal.id}`)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1,
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: '3px solid #e0e0e0',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      Escrever
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleEditOpen(proposal)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1,
                        borderRadius: 3,
                        backgroundColor: '#757575',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#616161',
                        },
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(proposal.id)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1,
                        borderRadius: 3,
                        backgroundColor: '#91103c',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#7a0d32',
                        },
                      }}
                    >
                      Apagar
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma proposta encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente buscar com outros termos
          </Typography>
        </Box>
      )}

      {/* Modal de Edição */}
      <Dialog open={!!editingProposal} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Proposta</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              fullWidth
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              label="Texto Motivador"
              fullWidth
              multiline
              rows={6}
              value={editForm.text}
              onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
            />
            <TextField
              label="URL da Imagem (opcional)"
              fullWidth
              value={editForm.imageUrl}
              onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
