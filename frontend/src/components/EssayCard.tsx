'use client';

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';

interface EssayCardProps {
  id: string;
  proposalId: string;
  proposalTitle: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
  createdAt: string;
  text: string;
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

export default function EssayCard({
  id,
  proposalId,
  proposalTitle,
  status,
  createdAt,
  text,
}: EssayCardProps) {
  // Calcular tempo desde a última edição
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const lastEditText = diffDays === 0 ? 'hoje' : `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

  // Simular nível (poderia vir da proposta no futuro)
  const level = 'INTERMEDIATE' as const;

  return (
    <Card
      sx={{
        width: 320,
        minWidth: 320,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        '&:last-child': { pb: 2 }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" fontWeight="600" sx={{ fontSize: '1rem', flexGrow: 1, pr: 1 }}>
            {proposalTitle}
          </Typography>
          <Chip
            label={levelLabels[level]}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: '22px',
              bgcolor: levelStyles[level].bgcolor,
              color: levelStyles[level].color,
              fontWeight: 500,
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          Última edição: {lastEditText}
        </Typography>
      </CardContent>
    </Card>
  );
}
