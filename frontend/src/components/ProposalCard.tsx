'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface ProposalCardProps {
  id: string;
  title: string;
  text: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
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

export default function ProposalCard({
  id,
  title,
  text,
  level,
}: ProposalCardProps) {
  // Truncar o texto para mostrar apenas um pedaço
  const truncatedText = text.length > 100 ? `${text.substring(0, 100)}...` : text;

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="h6" component="h3" fontWeight="600" sx={{ fontSize: '1rem', flexGrow: 1, pr: 1 }}>
            {title}
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

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          {truncatedText}
        </Typography>
      </CardContent>
    </Card>
  );
}
