'use client';

import { useState, useContext } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/providers/AuthProvider';

const levels = [
  { value: 'BASIC', label: 'Básico' },
  { value: 'INTERMEDIATE', label: 'Intermediário' },
  { value: 'ADVANCED', label: 'Avançado' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: '',
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      level: '',
    };
    let isValid = true;

    if (!name) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }

    if (!level) {
      newErrors.level = 'Nível é obrigatório';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Cadastrar usuário
      await api.post('/v1/signup', {
        name,
        email,
        password,
        level,
      });

      // Fazer login automaticamente
      const loginSuccess = await login(email, password);

      if (loginSuccess) {
        // Redirecionar para o dashboard
        router.push('/dashboard');
      } else {
        setErrorMessage('Cadastro realizado, mas erro ao fazer login. Tente fazer login manualmente.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response?.status === 409) {
        setErrorMessage('Email já cadastrado. Tente fazer login.');
      } else {
        setErrorMessage('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Grammaid
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crie sua conta
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label="alternar visibilidade da senha"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirmar Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      aria-label="alternar visibilidade da confirmação de senha"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Nível de Inglês"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              error={!!errors.level}
              helperText={errors.level}
              margin="normal"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {levels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
              }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Button
                  onClick={() => router.push('/login')}
                  sx={{
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    fontWeight: 'bold',
                  }}
                >
                  Fazer login
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
