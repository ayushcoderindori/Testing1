import React from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleReload}
            >
              Reload Page
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ErrorBoundary;
