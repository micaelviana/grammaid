'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { TrendingUp, EmojiEvents } from '@mui/icons-material';

interface ProgressCardProps {
  currentLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  nextLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | null;
  eligibleReviewsCount: number;
  requiredReviews: number;
  averageScore: number | null;
  isEligibleForPromotion: boolean;
  message: string;
}

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

const levelLabels = {
  BASIC: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
};

export default function ProgressCard({
  currentLevel,
  nextLevel,
  eligibleReviewsCount,
  requiredReviews,
  averageScore,
  isEligibleForPromotion,
  message,
}: ProgressCardProps) {
  const progress = (eligibleReviewsCount / requiredReviews) * 100;
  const isMaxLevel = !nextLevel;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Cabeçalho com ícone e título */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {isMaxLevel ? (
              <EmojiEvents sx={{ fontSize: 24, color: '#ffd700' }} />
            ) : (
              <TrendingUp sx={{ fontSize: 24, color: 'primary.main' }} />
            )}
            <Typography variant="h6" component="h3" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
              {isMaxLevel ? 'Nível Máximo Atingido!' : 'Progresso para o Próximo Nível'}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5 }}>
            Para subir de nível, você deve fazer 10 redações consecutivas no seu nível atual ou superior, corrigidas com aproveitamento geral maior ou igual a 75%
          </Typography>
        </Box>

        {/* Níveis */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
          <Chip
            label={levelLabels[currentLevel]}
            size="small"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              bgcolor: levelStyles[currentLevel].bgcolor,
              color: levelStyles[currentLevel].color,
            }}
          />
          {nextLevel && (
            <>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>→</Typography>
              <Chip
                label={levelLabels[nextLevel]}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(0,0,0,0.08)',
                  color: 'text.primary',
                }}
              />
            </>
          )}
        </Box>

        {/* Progresso visual */}
        {!isMaxLevel && (
          <>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  Redações Elegíveis
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {eligibleReviewsCount}/{requiredReviews}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: isEligibleForPromotion ? '#4caf50' : 'primary.main',
                    borderRadius: 5,
                  },
                }}
              />
            </Box>

            {/* Média */}
            {averageScore !== null && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    Média Atual
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: averageScore >= 75 ? '#2e7d32' : '#c62828',
                    }}
                  >
                    {averageScore.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}

        {/* Mensagem */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: isEligibleForPromotion
              ? 'rgba(76, 175, 80, 0.1)'
              : isMaxLevel
                ? 'rgba(255, 215, 0, 0.1)'
                : 'rgba(0,0,0,0.05)',
            border: isEligibleForPromotion
              ? '1px solid rgba(76, 175, 80, 0.3)'
              : isMaxLevel
                ? '1px solid rgba(255, 215, 0, 0.3)'
                : 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.5,
              color: isEligibleForPromotion
                ? '#2e7d32'
                : isMaxLevel
                  ? '#8B4513'
                  : 'inherit',
            }}
          >
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
