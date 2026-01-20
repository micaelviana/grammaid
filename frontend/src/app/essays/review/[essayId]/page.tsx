/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Tabs,
  Tab,
  Rating,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowBack, HelpOutline } from '@mui/icons-material';
import api from '@/utils/api';

interface Error {
  id: string;
  errorType: string;
  description: string;
  suggestion: string;
  startingPos: number;
  endingPos: number;
}

interface Criteria {
  id: string;
  criteriaType: 'CONTENT' | 'ORGANIZATION' | 'GRAMMAR';
  score: number;
  Error: Error[];
}

interface Review {
  id: string;
  score: number;
  suggestedText: string;
  modelVersion: string;
  createdAt: string;
  criteria: Criteria[];
}

interface Essay {
  id: string;
  text: string;
  status: string;
  createdAt: string;
  proposal: {
    id: string;
    title: string;
    level: string;
  };
  user: {
    id: string;
    name: string;
    level: string;
  };
}

const levelLabels: Record<string, string> = {
  BASIC: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
};

const levelStyles: Record<string, { bgcolor: string; color: string }> = {
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

const criteriaColors: Record<string, { bg: string; text: string; label: string }> = {
  ORGANIZATION: { bg: '#ffe8e8', text: '#d32f2f', label: 'Organização' },
  CONTENT: { bg: '#fff9c4', text: '#f57c00', label: 'Conteúdo' },
  GRAMMAR: { bg: '#e3f2fd', text: '#1976d2', label: 'Gramática' },
};

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const essayId = params.essayId as string;

  const [essay, setEssay] = useState<Essay | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(`/v1/essay/${essayId}/review`);
        setEssay(response.data.essay);
        setReview(response.data.review);
      } catch (err: any) {
        console.error('Erro ao carregar correção:', err);
        if (err.response?.status === 404) {
          setError('Correção não encontrada para esta redação');
        } else {
          setError('Erro ao carregar correção');
        }
      } finally {
        setLoading(false);
      }
    };

    if (essayId) {
      fetchReview();
    }
  }, [essayId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando correção...
        </Typography>
      </Container>
    );
  }

  if (error || !essay || !review) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Correção não encontrada'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/essays')}
          sx={{ mt: 2 }}
        >
          Voltar para redações
        </Button>
      </Container>
    );
  }

  // Calculate stars (score 0-100 → 0-5 stars)
  const score = review.score;
  const stars = (score / 100) * 5;

  // Find scores for each criteria
  const orgCriteria = review.criteria.find((c) => c.criteriaType === 'ORGANIZATION');
  const contentCriteria = review.criteria.find((c) => c.criteriaType === 'CONTENT');
  const grammarCriteria = review.criteria.find((c) => c.criteriaType === 'GRAMMAR');

  const orgScore = orgCriteria?.score || 0;
  const contentScore = contentCriteria?.score || 0;
  const grammarScore = grammarCriteria?.score || 0;

  // Function to render text with error highlights
  const renderTextWithHighlights = () => {
    // Collect all errors and filter invalid positions
    const allErrors = review.criteria
      .flatMap((c) =>
        c.Error.map((e) => ({ ...e, criteriaType: c.criteriaType }))
      )
      .filter((error) => {
        // Filter out errors with invalid positions
        const isValid =
          error.startingPos >= 0 &&
          error.endingPos > error.startingPos &&
          error.endingPos <= essay.text.length;

        if (!isValid) {
          console.warn('Skipping error with invalid positions:', {
            type: error.errorType,
            startingPos: error.startingPos,
            endingPos: error.endingPos,
            textLength: essay.text.length,
          });
        }

        return isValid;
      })
      .sort((a, b) => a.startingPos - b.startingPos);

    // Remove overlapping errors (keep the first one)
    const nonOverlappingErrors = [];
    let lastEndPos = 0;

    allErrors.forEach((error) => {
      if (error.startingPos >= lastEndPos) {
        nonOverlappingErrors.push(error);
        lastEndPos = error.endingPos;
      } else {
        console.warn('Skipping overlapping error:', {
          type: error.errorType,
          startingPos: error.startingPos,
          endingPos: error.endingPos,
        });
      }
    });

    // Split text into segments
    const segments = [];
    let lastPos = 0;

    nonOverlappingErrors.forEach((error) => {
      // Text before the error
      if (error.startingPos > lastPos) {
        segments.push({
          text: essay.text.substring(lastPos, error.startingPos),
          isError: false,
        });
      }

      // Error text
      segments.push({
        text: essay.text.substring(error.startingPos, error.endingPos),
        isError: true,
        criteriaType: error.criteriaType,
        errorData: error,
      });

      lastPos = error.endingPos;
    });

    // Remaining text
    if (lastPos < essay.text.length) {
      segments.push({
        text: essay.text.substring(lastPos),
        isError: false,
      });
    }

    return (
      <Typography
        component="div"
        sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
      >
        {segments.map((segment: any, idx) =>
          segment.isError ? (
            <Box
              key={idx}
              component="span"
              sx={{
                backgroundColor: criteriaColors[segment.criteriaType].bg,
                color: criteriaColors[segment.criteriaType].text,
                textDecoration: 'underline',
                textDecorationStyle: 'wavy',
                cursor: 'pointer',
                '&:hover': { fontWeight: 'bold' },
              }}
              title={segment.errorData.description}
            >
              {segment.text}
            </Box>
          ) : (
            <span key={idx}>{segment.text}</span>
          )
        )}
      </Typography>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative' }}>
      {/* Ícone de informação sobre o sistema de estrelas */}
      {/* <Tooltip */}
      {/*   title="O sistema de estrelas converte sua nota percentual. A fórmula é (((Organização + Conteúdo + Gramática) / 3)/100)*5" */}
      {/*   placement="left" */}
      {/*   arrow */}
      {/* > */}
      {/*   <IconButton */}
      {/*     sx={{ */}
      {/*       position: 'absolute', */}
      {/*       top: 0, */}
      {/*       right: 0, */}
      {/*       color: 'primary.main', */}
      {/*       '&:hover': { */}
      {/*         backgroundColor: 'rgba(0, 0, 0, 0.04)', */}
      {/*       }, */}
      {/*     }} */}
      {/*   > */}
      {/*     <HelpOutline /> */}
      {/*   </IconButton> */}
      {/* </Tooltip> */}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/essays')}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Chip
            label={levelLabels[essay.proposal.level] || essay.proposal.level}
            size="small"
            sx={{
              backgroundColor: levelStyles[essay.proposal.level]?.bgcolor || '#e0e0e0',
              color: levelStyles[essay.proposal.level]?.color || '#000',
              fontWeight: 500,
            }}
          />
          <Chip
            label="Review"
            size="small"
            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 500 }}
          />
        </Box>

        <Typography variant="h5" component="h1" fontWeight="600">
          Correção: {essay.proposal.title}
        </Typography>
      </Box>

      {/* Avaliação Geral */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="600">
              Avaliação Geral
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A IA pode cometer erros. Confira as informações.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.primary', lineHeight: 1.5, marginBottom: 3 }}>
              Score geral: {score.toFixed(2)}%
            </Typography>
            {/* <Rating value={stars} precision={0.5} readOnly /> */}
            {/* <Typography variant="caption" color="text.secondary" display="block"> */}
            {/*   {stars.toFixed(1)}/5 estrelas */}
            {/* </Typography> */}
          </Box>
        </Box>

        {/* Scores by Criteria */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
            >
              {orgScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organização
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
            >
              {contentScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conteúdo
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
            >
              {grammarScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gramática
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs: Correções / Texto Sugerido */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, backgroundColor: '#fff' }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, v) => setCurrentTab(v)}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tab label="Correções" />
          <Tab label="Texto Sugerido" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <>
              {/* Sua Redação com Correções */}
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sua Redação com Correções
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Passe o mouse sobre as marcações coloridas para ver as sugestões
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }}
              >
                {renderTextWithHighlights()}
              </Paper>

              {/* Legenda das Correções */}
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Legenda das Correções
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: criteriaColors.ORGANIZATION.bg,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {criteriaColors.ORGANIZATION.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: criteriaColors.CONTENT.bg,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {criteriaColors.CONTENT.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: criteriaColors.GRAMMAR.bg,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {criteriaColors.GRAMMAR.label}
                  </Typography>
                </Box>
              </Box>

              {/* Sugestões Detalhadas */}
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sugestões Detalhadas
              </Typography>

              {review.criteria.map((criteria) => (
                <Box key={criteria.id} sx={{ mb: 2 }}>
                  {criteria.Error.map((error) => (
                    <Paper
                      key={error.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: '#fff',
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={criteriaColors[criteria.criteriaType].label}
                          size="small"
                          sx={{
                            bgcolor: criteriaColors[criteria.criteriaType].bg,
                            color: criteriaColors[criteria.criteriaType].text,
                            fontWeight: 500,
                          }}
                        />
                        <Typography variant="body2" fontWeight="600">
                          {(() => {
                            const errorText = essay.text.substring(error.startingPos, error.endingPos);
                            // Se o texto extraído parecer válido (não muito longo, não vazio)
                            if (errorText.length > 0 && errorText.length < 50) {
                              return `"${errorText}" → "${error.suggestion}"`;
                            }
                            // Fallback: mostrar apenas a sugestão
                            return `Sugestão: "${error.suggestion}"`;
                          })()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {error.description}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ))}
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Texto Sugerido
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Versão corrigida da sua redação
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }}
              >
                <Typography sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {review.suggestedText}
                </Typography>
              </Paper>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
