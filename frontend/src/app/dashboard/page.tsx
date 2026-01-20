'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { MenuBook, AccessTime, HelpOutline } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import ProposalCard from '@/components/ProposalCard';
import EssayCard from '@/components/EssayCard';
import ProgressCard from '@/components/ProgressCard';

interface User {
  userId: string;
  userName: string;
  userLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  userType: number;
}

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
    text: string;
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  };
}

interface ProgressData {
  currentLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  nextLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | null;
  eligibleReviewsCount: number;
  requiredReviews: number;
  averageScore: number | null;
  isEligibleForPromotion: boolean;
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do usuário
        const userResponse = await api.get('/v1/me');
        const userData = userResponse.data as User;
        setUser(userData);

        // Buscar propostas recomendadas
        const proposalsResponse = await api.get(
          `/v1/proposal/recommendations?level=${userData.userLevel}`
        );
        setProposals(proposalsResponse.data);

        // Buscar redações recentes do usuário
        const essaysResponse = await api.get(
          `/v1/essay/user/${userData.userId}/recent`
        );
        setEssays(essaysResponse.data);

        // Buscar dados de progresso do usuário
        const progressResponse = await api.get('/v1/promotion/progress');
        setProgressData(progressResponse.data);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        if (err.response?.status === 401) {
          // Não autenticado, redirecionar para login
          router.push('/login');
        } else {
          setError('Erro ao carregar dados. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando...
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
      {/* Ícone de informação sobre progressão de nível */}
      {/* Seção de Propostas Recomendadas */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook sx={{ fontSize: 20 }} />
            <Typography variant="h6" component="h2" fontWeight="400" sx={{ fontSize: '1rem' }}>
              Redações Sugeridas
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={() => router.push('/proposals')}
          >
            Ver todas
          </Button>
        </Box>

        {/* Lista horizontal de propostas */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
          }}
        >
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <Box key={proposal.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <ProposalCard
                  id={proposal.id}
                  title={proposal.title}
                  text={proposal.text}
                  level={proposal.level}
                />
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
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma proposta disponível no momento.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Seção de Redações Recentes */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 20 }} />
            <Typography variant="h6" component="h2" fontWeight="400" sx={{ fontSize: '1rem' }}>
              Redações Recentes
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={() => router.push('/essays')}
          >
            Ver todas
          </Button>
        </Box>

        {/* Lista horizontal de redações */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
          }}
        >
          {essays.length > 0 ? (
            essays.map((essay) => (
              <Box key={essay.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <EssayCard
                  id={essay.id}
                  proposalId={essay.proposalId}
                  proposalTitle={essay.proposal.title}
                  status={essay.status}
                  createdAt={essay.createdAt}
                  text={essay.text}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push(`/essays/new/${essay.proposalId}?essayId=${essay.id}`)}
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
                  Continuar
                </Button>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Você ainda não escreveu nenhuma redação.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Seção de Progresso */}
      {progressData && (
        <Box>
          <ProgressCard
            currentLevel={progressData.currentLevel}
            nextLevel={progressData.nextLevel}
            eligibleReviewsCount={progressData.eligibleReviewsCount}
            requiredReviews={progressData.requiredReviews}
            averageScore={progressData.averageScore}
            isEligibleForPromotion={progressData.isEligibleForPromotion}
            message={progressData.message}
          />
        </Box>
      )}
    </Container>
  );
}
